#!/usr/bin/env node
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import process from 'node:process';

const [, , rawEntry, ...passedArgs] = process.argv;

if (!rawEntry) {
  console.error('Usage: node scripts/run-dist-entry.mjs <ts-entry> [args...]');
  process.exit(1);
}

const normalizeEntry = (entry) => entry.replace(/^\.\/?/, '');
const entry = normalizeEntry(rawEntry);
const distEntry = entry.replace(/\.(ts|tsx)$/u, '.js');
const distPath = resolve('dist', distEntry);
const srcPath = resolve(entry);

let needsBuild = false;

try {
  const distStat = statSync(distPath);
  const srcStat = statSync(srcPath);
  if (srcStat.mtimeMs > distStat.mtimeMs) {
    needsBuild = true;
  }
} catch (error) {
  needsBuild = true;
}

if (needsBuild) {
  const buildResult = spawnSync('pnpm', ['-s', 'build'], {
    stdio: 'inherit',
    shell: false,
  });

  if (buildResult.status !== 0) {
    process.exit(buildResult.status ?? 1);
  }

  if (!existsSync(distPath)) {
    console.error(`Expected dist artifact missing: ${distPath}`);
    process.exit(1);
  }
}

const execution = spawnSync('node', [distPath, ...passedArgs], {
  stdio: 'inherit',
  shell: false,
});

process.exit(execution.status ?? 0);
