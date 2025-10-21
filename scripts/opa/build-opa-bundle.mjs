#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const OPA_DIR = process.env.OPA_DIR || path.join(ROOT, 'apps', 'ethics-api', 'opa');
const DIST_DIR = path.join(ROOT, 'dist', 'opa');
const OPA_BIN =
  process.env.OPA_BIN || path.join(ROOT, 'bin', process.platform === 'win32' ? 'opa.exe' : 'opa');
const OUT_FILE = process.env.OPA_BUNDLE || path.join(DIST_DIR, 'mandala-ethics-bundle.tar.gz');

mkdirSync(DIST_DIR, { recursive: true });

function resolveRevision() {
  if (process.env.OPA_REVISION && process.env.OPA_REVISION.trim().length > 0) {
    return process.env.OPA_REVISION.trim();
  }
  if (process.env.GIT_SHA && process.env.GIT_SHA.trim().length > 0) {
    return process.env.GIT_SHA.trim();
  }
  const git = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT, encoding: 'utf8' });
  const rev = git.stdout?.trim();
  if (git.status === 0 && rev) {
    return rev;
  }
  return String(Date.now());
}

const revision = resolveRevision();
const args = ['build', '-b', OPA_DIR, '-o', OUT_FILE, '--revision', revision];
const result = spawnSync(OPA_BIN, args, { stdio: 'inherit', shell: process.platform === 'win32' });

if (result.status !== 0) {
  console.error('[opa:bundle] build failed');
  process.exit(result.status ?? 1);
}

const manifestPath = path.join(DIST_DIR, 'manifest.json');
try {
  const manifest = JSON.parse(readFileSync(path.join(OPA_DIR, 'manifest.json'), 'utf8'));
  manifest.revision = revision;
  manifest.built_at = new Date().toISOString();
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
} catch (error) {
  writeFileSync(
    manifestPath,
    `${JSON.stringify({ revision, built_at: new Date().toISOString() }, null, 2)}\n`,
    'utf8',
  );
}

console.log(OUT_FILE);
