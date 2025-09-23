#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const steps = [['keys-empty', path.join(__dirname, 'check-keys-empty.mjs')]];

let hasFailure = false;

for (const [label, script] of steps) {
  const result = spawnSync('node', [script], {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if ((result.status ?? 1) !== 0) {
    console.error(`[sanity] step ${label} failed`);
    hasFailure = true;
  }
}

if (hasFailure) {
  process.exit(1);
}
