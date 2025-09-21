#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export function runTypedoc() {
  execSync('npx typedoc', { stdio: 'inherit' });
  console.log('API docs generated in docs/api');
}

const invokedFromCli =
  typeof process.argv[1] === 'string' &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (invokedFromCli) {
  runTypedoc();
}
