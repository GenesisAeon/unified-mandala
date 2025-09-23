#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const run = (label, command) => {
  console.log(`\n=== ${label} ===`);
  const [bin, ...args] = command.split(' ');
  const result = spawnSync(bin, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if ((result.status ?? 1) !== 0) {
    throw new Error(`${label} failed`);
  }
};

try {
  run('PNPM version', 'pnpm -v');
  run('Typecheck', 'pnpm typecheck');
  run('Unit tests', 'pnpm test:unit');
  run('Coverage', 'pnpm test:unit:coverage');
  run('Schema validate', 'pnpm schema:validate');
  run('Maps validate', 'pnpm maps:validate');
  run('Repomap build', 'pnpm repomap:build');
  run('Repomap validate', 'pnpm repomap:validate');
  run('Sanity', 'pnpm sanity');
  run('Policy suite', 'pnpm policy:check');
  console.log('\nCI verify ✓');
  process.exit(0);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
