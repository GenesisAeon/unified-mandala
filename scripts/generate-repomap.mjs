#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const result = spawnSync('node', ['scripts/run-dist.mjs', 'scripts/repo-map.ts'], {
  cwd: projectRoot,
  stdio: 'inherit',
});

if (result.error) {
  console.error('Failed to launch repo map generator:', result.error.message);
  process.exitCode = 1;
} else if (result.status !== 0) {
  process.exitCode = result.status ?? 1;
}
