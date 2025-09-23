#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const steps = [
  ['repo-sanity', ['node', 'scripts/repo-sanity.mjs']],
  ['keys-empty', ['node', 'scripts/sanity/check-keys-empty.mjs']],
];

let hasFailure = false;
for (const [label, [command, ...args]] of steps) {
  console.log(`\n[sanity] ${label}`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if ((result.status ?? 1) !== 0) {
    hasFailure = true;
  }
}

process.exit(hasFailure ? 1 : 0);
