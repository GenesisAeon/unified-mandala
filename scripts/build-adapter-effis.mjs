import { existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import process from 'node:process';
import { spawnPython, pythonEnv } from './lib/python.mjs';

const repoRoot = resolve(process.cwd());
const env = pythonEnv({
  CI: process.env.CI ?? 'true',
  ALLOW_NET: process.env.ALLOW_NET ?? '0',
});

['data/raw', 'data/processed', 'data/stac', 'data/mrv'].forEach((dir) => {
  const full = join(repoRoot, dir);
  if (!existsSync(full)) {
    mkdirSync(full, { recursive: true });
  }
});

runPython(['src/adapters/effis/fetch_effis.py', '2024', '6', 'data/raw'], 'Fetch EFFIS fixture');
runPython(
  [
    'src/adapters/era5/resample.py',
    'data/raw/effis_202406.nc',
    'data/processed/effis_resampled.nc',
  ],
  'Resample ERA5 grid',
);
runPython(
  [
    '-c',
    [
      'from src.adapters.core.stac import make_stac_item',
      'import json',
      "print(json.dumps(make_stac_item('data/processed/effis_resampled.nc','effis_202406','fwi')))",
    ].join('; '),
  ],
  'Generate STAC metadata',
);

console.log('✅ EFFIS pipeline (offline) done');

function runPython(args, label) {
  console.log(`⏳ ${label}`);
  const result = spawnPython(args, {
    cwd: repoRoot,
    env,
    stdio: 'inherit',
  });
  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}
