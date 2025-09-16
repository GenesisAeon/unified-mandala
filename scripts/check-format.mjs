#!/usr/bin/env node
import { execSync, spawnSync } from 'node:child_process';
import path from 'node:path';

const args = process.argv.slice(2);
let baseRef = 'HEAD';
let useStaged = false;

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === '--staged') {
    useStaged = true;
    continue;
  }
  if (arg.startsWith('--base=')) {
    baseRef = arg.split('=')[1] ?? baseRef;
    continue;
  }
  if (arg === '--base' && i + 1 < args.length) {
    baseRef = args[i + 1];
    i += 1;
  }
}

const DIFF_ARGS = useStaged
  ? ['diff', '--name-only', '--diff-filter=ACMRTUXB', '--staged']
  : ['diff', '--name-only', '--diff-filter=ACMRTUXB', baseRef];

let diffOutput = '';
try {
  diffOutput = execSync(`git ${DIFF_ARGS.join(' ')}`, { encoding: 'utf-8' });
} catch (error) {
  console.error('Failed to collect changed files for Prettier check.');
  console.error(String(error));
  process.exit(1);
}

const SUPPORTED_EXTENSIONS = new Set([
  '.js',
  '.cjs',
  '.mjs',
  '.ts',
  '.tsx',
  '.jsx',
  '.json',
  '.json5',
  '.md',
  '.mdx',
  '.yml',
  '.yaml',
  '.css',
  '.scss',
  '.less'
]);

const files = diffOutput
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .filter((file) => SUPPORTED_EXTENSIONS.has(path.extname(file)));

if (files.length === 0) {
  console.log('No files with Prettier support changed. Skipping format check.');
  process.exit(0);
}

const prettierArgs = ['exec', 'prettier', '--check', ...files];
const result = spawnSync('pnpm', prettierArgs, { stdio: 'inherit' });

if (result.error) {
  console.error('Failed to run prettier:', result.error);
  process.exit(result.status ?? 1);
}

process.exit(result.status ?? 0);
