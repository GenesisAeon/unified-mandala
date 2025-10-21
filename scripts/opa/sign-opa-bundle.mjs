#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const DIST_DIR = path.join(ROOT, 'dist', 'opa');
const BUNDLE = process.env.OPA_BUNDLE || path.join(DIST_DIR, 'mandala-ethics-bundle.tar.gz');

if (!fs.existsSync(BUNDLE)) {
  console.error('[opa:sign] bundle not found:', BUNDLE);
  process.exit(1);
}

const buf = fs.readFileSync(BUNDLE);
const sha = createHash('sha256').update(buf).digest('hex');
fs.writeFileSync(`${BUNDLE}.sha256`, `${sha}\n`, 'utf8');
console.log('[opa:sign] sha256:', sha);

if (process.env.OPA_SIGN_ENABLE !== '1') {
  process.exit(0);
}

const GPG_BIN = process.env.OPA_SIGN_GPG_BIN || 'gpg';
const KEY = process.env.OPA_SIGN_GPG_KEY;
if (!KEY) {
  console.error('[opa:sign] OPA_SIGN_GPG_KEY not set, skipping ascii-armored signature.');
  process.exit(0);
}

const args = [
  '--batch',
  '--yes',
  '--local-user',
  KEY,
  '--armor',
  '--output',
  `${BUNDLE}.asc`,
  '--detach-sign',
  BUNDLE,
];
const res = spawnSync(GPG_BIN, args, { stdio: 'inherit', shell: process.platform === 'win32' });
if (res.status !== 0) {
  console.error('[opa:sign] gpg signing failed');
  process.exit(res.status ?? 1);
}
console.log('[opa:sign] wrote:', `${BUNDLE}.asc`);
