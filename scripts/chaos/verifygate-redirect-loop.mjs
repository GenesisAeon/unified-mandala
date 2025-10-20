#!/usr/bin/env node
/* eslint-disable no-console */
import { spawn } from 'node:child_process';

const extraArgs = process.argv.slice(2);
const vitestArgs = [
  'vitest',
  'run',
  'apps/verify-gate/src/__tests__/chaos-redirect-loop.test.ts',
  ...extraArgs,
];

console.log('[chaos] verify-gate redirect loop drill → pnpm', vitestArgs.join(' '));

const child = spawn('pnpm', vitestArgs, { stdio: 'inherit', shell: false });

child.on('exit', (code, signal) => {
  if (signal) {
    console.error(`[chaos] vitest terminated via signal ${signal}`);
    process.exit(1);
  }
  process.exit(code ?? 1);
});

child.on('error', (error) => {
  console.error('[chaos] failed to launch vitest', error);
  process.exit(1);
});
