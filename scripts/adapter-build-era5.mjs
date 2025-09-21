import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import process from 'node:process';
import { spawnPython, pythonEnv } from './lib/python.mjs';

const repoRoot = resolve(process.cwd());
const pythonEnvironment = pythonEnv({
  CI: process.env.CI ?? 'true',
  ALLOW_NET: process.env.ALLOW_NET ?? '0',
});

mkdirSync(join(repoRoot, 'data/raw'), { recursive: true });

runPython(
  [
    '-c',
    "from adapters.era5.fixture import write_synthetic_era5 as w; import os; os.makedirs('data/raw', exist_ok=True); print(w('data/raw/era5_synth.nc'))",
  ],
  'Generate synthetic ERA5 fixture',
);
runNode(['scripts/adapter-postprocess.mjs', 'era5'], 'Postprocess ERA5 artifacts');

function runPython(args, label) {
  console.log(`⏳ ${label}`);
  const result = spawnPython(args, {
    cwd: repoRoot,
    env: pythonEnvironment,
    stdio: 'inherit',
  });
  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runNode(args, label) {
  console.log(`⏳ ${label}`);
  const result = spawnSync(process.execPath, args, {
    cwd: repoRoot,
    env: process.env,
    stdio: 'inherit',
  });
  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}
