#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const defaultBinaryName = process.platform === 'win32' ? 'opa.exe' : 'opa';
const localCandidate = path.join(ROOT, 'bin', defaultBinaryName);
const fromEnv = process.env.OPA_BIN && process.env.OPA_BIN.trim();
const resolvedCandidate = fromEnv ? path.resolve(fromEnv) : localCandidate;
const OPA_BIN = fs.existsSync(resolvedCandidate) ? resolvedCandidate : defaultBinaryName;

const OPA_DIR = process.env.OPA_DIR
  ? path.resolve(process.env.OPA_DIR)
  : path.join(ROOT, 'apps', 'ethics-api', 'opa');

const args = ['test', '--format', 'pretty', '--verbose', OPA_DIR];
const passthrough = process.argv.slice(2);
if (passthrough.length) args.push(...passthrough);

const result = spawnSync(OPA_BIN, args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.error) {
  console.error(`[opa:test] failed to start ${OPA_BIN}: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
