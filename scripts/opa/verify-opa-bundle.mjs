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
const OPA_BIN =
  process.env.OPA_BIN || path.join(ROOT, 'bin', process.platform === 'win32' ? 'opa.exe' : 'opa');
const BUNDLE = process.env.OPA_BUNDLE || path.join(DIST_DIR, 'mandala-ethics-bundle.tar.gz');
const SHA_FILE = process.env.OPA_BUNDLE_SHA256 || `${BUNDLE}.sha256`;
const ASC_FILE = process.env.OPA_BUNDLE_ASC || `${BUNDLE}.asc`;
const PUBRING = process.env.ETHICS_OPA_PUBRING || process.env.OPA_PUBRING;

if (!fs.existsSync(BUNDLE)) {
  console.error('[opa:verify] bundle not found:', BUNDLE);
  process.exit(1);
}

function checkSha() {
  if (!fs.existsSync(SHA_FILE)) {
    return { ok: true, source: null };
  }
  const expected = fs.readFileSync(SHA_FILE, 'utf8').trim().split(/\s+/)[0];
  const have = createHash('sha256').update(fs.readFileSync(BUNDLE)).digest('hex');
  if (expected !== have) {
    console.error('[opa:verify] sha256 mismatch:', have, '!=', expected);
    return { ok: false, source: SHA_FILE };
  }
  console.log('[opa:verify] sha256 OK');
  return { ok: true, source: SHA_FILE };
}

const shaResult = checkSha();
if (!shaResult.ok) {
  process.exit(2);
}

function checkGpg() {
  if (!fs.existsSync(ASC_FILE)) {
    return { ok: true, present: false };
  }
  const bin = (process.env.OPA_SIGN_GPG_BIN || 'gpg').toString();
  const args = PUBRING
    ? ['--batch', '--no-default-keyring', '--keyring', PUBRING, '--verify', ASC_FILE, BUNDLE]
    : ['--batch', '--verify', ASC_FILE, BUNDLE];
  const res = spawnSync(bin, args, {
    stdio: 'pipe',
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  if (res.status !== 0) {
    process.stdout.write(res.stdout ?? '');
    process.stderr.write(res.stderr ?? '');
    console.error('[opa:verify] gpg verify failed');
    return { ok: false, present: true };
  }
  process.stdout.write(res.stdout ?? '');
  process.stderr.write(res.stderr ?? '');
  console.log('[opa:verify] gpg signature OK');
  return { ok: true, present: true };
}

const gpgResult = checkGpg();
if (!gpgResult.ok) {
  process.exit(3);
}

const input = JSON.stringify({
  degraded: false,
  network: {
    ttl_sec: 300,
    tls_san_ok: true,
    redirect_hops: 0,
    resolved_ip: '93.184.216.34',
  },
  evidence_domains_distinct: 2,
  has_strong_evidence: true,
});
const evalArgs = ['eval', '-b', BUNDLE, '-I', 'data.mandala.ethics.output'];
const evalRes = spawnSync(OPA_BIN, evalArgs, {
  input,
  stdio: ['pipe', 'inherit', 'inherit'],
  shell: process.platform === 'win32',
});
process.exit(evalRes.status ?? 0);
