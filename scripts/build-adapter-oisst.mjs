import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import process from 'node:process';
import { spawnPython, pythonEnv } from './lib/python.mjs';

const repoRoot = resolve(process.cwd());
const env = pythonEnv({
  CI: process.env.CI ?? 'true',
  ALLOW_NET: process.env.ALLOW_NET ?? '0',
});

mkdirSync(join(repoRoot, 'data/raw'), { recursive: true });
mkdirSync(join(repoRoot, 'data/processed'), { recursive: true });
mkdirSync(join(repoRoot, 'out/stac'), { recursive: true });
mkdirSync(join(repoRoot, 'out/metrics'), { recursive: true });
mkdirSync(join(repoRoot, 'out'), { recursive: true });

runPython(
  ['-m', 'adapters.oisst.fetch_oisst', '2023', '1', 'data/raw'],
  'Fetch synthetic OISST fixture',
);

const raw = readDirFirst(
  join(repoRoot, 'data/raw'),
  (n) => n.startsWith('oisst_') && n.endsWith('.nc'),
);
if (!raw) die('no raw oisst_*.nc produced');

const rawPath = join('data/raw', raw);
runPython(
  ['-m', 'adapters.oisst.postprocess_oisst', rawPath, 'data/processed', 'out/stac', 'out/metrics'],
  'Postprocess OISST data',
);

const stamp = raw.replace('oisst_', '').replace('.nc', '');
const itemId = `oisst-${stamp}`;
const stacPath = `out/stac/${itemId}.item.json`;
const metricsPath = `out/metrics/${itemId}.metrics.json`;
if (!existsSync(stacPath)) die(`missing STAC: ${stacPath}`);
if (!existsSync(metricsPath)) die(`missing metrics: ${metricsPath}`);

const indexPath = 'out/adapters_index.json';
let index = { adapters: [] };
if (existsSync(indexPath)) {
  try {
    index = JSON.parse(readFileSync(indexPath, 'utf8'));
  } catch {}
}
index.adapters = Array.isArray(index.adapters) ? index.adapters.filter((a) => a.id !== itemId) : [];
const metrics = JSON.parse(readFileSync(metricsPath, 'utf8'));
index.adapters.push({
  id: itemId,
  kind: 'oisst',
  stac: stacPath,
  crep: metrics.crep,
  processed: `data/processed/oisst_${stamp}.nc`,
});
writeFileSync(indexPath, JSON.stringify(index, null, 2));
console.log('✅ OISST pipeline complete');

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

function readDirFirst(dir, predicate) {
  try {
    const list = readdirSync(dir);
    return list.find(predicate);
  } catch {
    return undefined;
  }
}

function die(msg) {
  console.error(`❌ ${msg}`);
  process.exit(1);
}
