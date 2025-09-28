#!/usr/bin/env node
import { spawn } from 'node:child_process';

const provider = (process.env.AI_PROVIDER || '').toLowerCase();
const force = process.env.UM_RUN_QWEN_SMOKE === '1';
const skip = process.env.UM_SKIP_QWEN_SMOKE === '1';
const inGithubActions = process.env.GITHUB_ACTIONS === 'true';

if (skip) {
  console.log('[qwen-smoke] UM_SKIP_QWEN_SMOKE=1 → skipping smoke trigger.');
  process.exit(0);
}

if (!force && !provider.startsWith('qwen-')) {
  console.log('[qwen-smoke] AI_PROVIDER does not start with "qwen-" → skipping.');
  process.exit(0);
}

if (inGithubActions && !force) {
  console.log('[qwen-smoke] Running in GitHub Actions without force flag → skipping.');
  process.exit(0);
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
      }
    });
  });
}

(async () => {
  try {
    console.log('[qwen-smoke] Triggering pnpm smoke:qwen …');
    await run('pnpm', ['smoke:qwen']);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
