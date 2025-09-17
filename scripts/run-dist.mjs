#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';

const [, , target, ...args] = process.argv;

if (!target) {
  console.error('Usage: node scripts/run-dist.mjs <dist-relative-module> [args...]');
  process.exit(1);
}

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function resolveCandidate(candidate) {
  const normalized = candidate
    .replace(/^\.\//, '')
    .replace(/\\/g, '/')
    .replace(/\.(ts|js|cjs|mjs)$/i, '');
  return [
    resolve(rootDir, 'dist', `${normalized}.js`),
    resolve(rootDir, 'dist', `${normalized}.cjs`),
  ];
}

const candidates = resolveCandidate(target);
const scriptPath = candidates.find((file) => existsSync(file));

if (!scriptPath) {
  console.error(
    `Missing compiled artifact for ${target}. Run \`pnpm run build\` before executing this command.`,
  );
  process.exit(1);
}

const child = spawn(process.execPath, ['--enable-source-maps', scriptPath, ...args], {
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});
