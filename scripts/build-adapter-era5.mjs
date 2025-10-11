import { execSync } from 'child_process';
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';

const dirs = ['data/raw', 'data/processed', 'data/stac', 'data/mrv', 'out'];
dirs.forEach((d) => {
  if (!existsSync(d)) mkdirSync(d, { recursive: true });
});

const run = (cmd, desc) => {
  console.log(`⏳ ${desc}`);
  execSync(cmd, { stdio: 'inherit', env: { ...process.env, CI: process.env.CI || 'true' } });
};

try {
  run('python src/adapters/era5/fetch.py', 'ERA5 fetch');
  if (!process.env.CI) {
    run('python src/adapters/era5/stac.py', 'STAC metadata');
    run('python src/adapters/era5/mrv.py', 'MRV export');
  }
  run(
    'python src/adapters/era5/resample.py data/raw/era5_2m_temperature_202409.nc data/processed/era5_2m_temperature_resampled.nc',
    'Resample',
  );
  const crep = execSync(
    'python src/adapters/era5/crep_score.py data/processed/era5_2m_temperature_resampled.nc',
    { stdio: 'pipe' },
  )
    .toString()
    .trim();
  const adapter = { id: 'era5_202409', source: 'era5', crepScore: Number(crep) };
  const idxPath = 'out/adapters_index.json';
  let arr = [];
  if (existsSync(idxPath)) arr = JSON.parse(readFileSync(idxPath, 'utf8'));
  arr = arr.filter((a) => a.id !== adapter.id);
  arr.push(adapter);
  writeFileSync(idxPath, JSON.stringify(arr, null, 2));
  console.log('CREP', crep);
  console.log('✅ ERA5 adapter pipeline complete');
} catch (e) {
  console.error('❌ ERA5 build failed');
  process.exit(1);
}
