#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const env = {
  ...process.env,
  PANTHEON_DISABLE: process.env.PANTHEON_DISABLE ?? '1',
  CI: process.env.CI ?? '1',
};

const steps = [
  ['Install check', 'pnpm -v'],
  ['Typecheck', 'pnpm typecheck'],
  ['Unit tests', 'pnpm test:unit'],
  ['Coverage (unit)', 'pnpm test:unit:coverage'],
  ['Schema validate', 'pnpm schema:validate'],
  ['Maps validate', 'pnpm maps:validate'],
  ['Repomap build', 'pnpm repomap:build'],
  ['Repomap validate', 'pnpm repomap:validate'],
  ['Sanity', 'pnpm sanity'],
  ['Policy suite', 'pnpm policy:check'],
];

function run(label, command) {
  console.log(`\n=== ${label} ===`);
  const [bin, ...args] = command.split(' ');
  const result = spawnSync(bin, args, {
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if ((result.status ?? 1) !== 0) {
    throw new Error(`${label} failed`);
  }
}

try {
  for (const [label, command] of steps) {
    run(label, command);
  }
  console.log('\nCI verify ✓');
  process.exit(0);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
