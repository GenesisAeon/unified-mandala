import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export interface PolicySignatureInfo {
  present: boolean;
  ok: boolean;
  issuer?: string | null;
  error?: string | null;
}

export interface PolicyStatusSnapshot {
  ok: boolean;
  bundlePath: string | null;
  bundleExists: boolean;
  sha256?: string | null;
  shaMatch: boolean | null;
  shaExpected?: string | null;
  shaSource?: 'env' | 'file' | null;
  signatureRequired: boolean;
  gpg: PolicySignatureInfo;
  revision?: string | null;
  checkedAt: string;
  reason?: string | null;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..', '..');
const DEFAULT_BUNDLE = path.join(ROOT, 'dist', 'opa', 'mandala-ethics-bundle.tar.gz');
const DIST_MANIFEST = path.join(ROOT, 'dist', 'opa', 'manifest.json');
const SOURCE_MANIFEST = path.join(ROOT, 'apps', 'ethics-api', 'opa', 'manifest.json');

let cachedStatus: PolicyStatusSnapshot | null = null;

function readFirstToken(filePath: string): string | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const [token] = raw.trim().split(/\s+/);
    return token?.length ? token : null;
  } catch {
    return null;
  }
}

function computeSha(filePath: string): string {
  return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function verifySignature(bundlePath: string, signaturePath: string | null, pubring?: string | null): PolicySignatureInfo {
  if (!signaturePath || !fs.existsSync(signaturePath)) {
    return { present: false, ok: false };
  }
  const bin = (process.env.OPA_SIGN_GPG_BIN || 'gpg').toString();
  const args = pubring
    ? ['--batch', '--no-default-keyring', '--keyring', pubring, '--verify', signaturePath, bundlePath]
    : ['--batch', '--verify', signaturePath, bundlePath];
  const result = spawnSync(bin, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
  });
  const combined = `${result.stdout ?? ''}\n${result.stderr ?? ''}`.trim();
  const issuerMatch = combined.match(/key\s+([0-9A-Fa-f]{8,})/);
  const issuer = issuerMatch ? issuerMatch[1] : null;
  if (result.status !== 0) {
    return { present: true, ok: false, issuer, error: combined.length ? combined : undefined };
  }
  return { present: true, ok: true, issuer };
}

function resolveRevision(): string | null {
  const fromEnv = process.env.ETHICS_POLICY_REV?.trim();
  if (fromEnv) {
    return fromEnv;
  }
  const manifestPaths = [DIST_MANIFEST, SOURCE_MANIFEST];
  for (const candidate of manifestPaths) {
    try {
      const data = JSON.parse(fs.readFileSync(candidate, 'utf8')) as { revision?: string };
      if (data.revision && String(data.revision).trim().length > 0) {
        return String(data.revision).trim();
      }
    } catch {
      continue;
    }
  }
  return null;
}

function computePolicyStatus(): PolicyStatusSnapshot {
  const bundlePath = (process.env.ETHICS_OPA_PATH && process.env.ETHICS_OPA_PATH.trim().length > 0)
    ? path.resolve(process.env.ETHICS_OPA_PATH)
    : DEFAULT_BUNDLE;
  const signatureRequired = process.env.ETHICS_POLICY_SIGNATURE_REQUIRED === '1';
  const bundleExists = fs.existsSync(bundlePath);

  const shaExpectedEnv = process.env.ETHICS_OPA_SIG_SHA256?.trim() ?? '';
  const shaExpectedFile = readFirstToken(process.env.ETHICS_OPA_SIG_SHA256_FILE ?? `${bundlePath}.sha256`);
  let shaExpected: string | null = null;
  let shaSource: 'env' | 'file' | null = null;
  if (shaExpectedEnv.length > 0) {
    shaExpected = shaExpectedEnv;
    shaSource = 'env';
  } else if (shaExpectedFile) {
    shaExpected = shaExpectedFile;
    shaSource = 'file';
  }

  const shaActual = bundleExists ? computeSha(bundlePath) : null;
  const shaMatch = shaExpected ? shaActual === shaExpected : null;
  const shaSatisfied = shaExpected ? shaMatch === true : !signatureRequired;

  const signaturePath = process.env.ETHICS_OPA_SIG_ASC?.trim()?.length
    ? path.resolve(process.env.ETHICS_OPA_SIG_ASC)
    : fs.existsSync(`${bundlePath}.asc`)
      ? `${bundlePath}.asc`
      : null;
  const pubring = process.env.ETHICS_OPA_PUBRING?.trim()?.length ? path.resolve(process.env.ETHICS_OPA_PUBRING) : null;
  const signatureInfo = verifySignature(bundlePath, signaturePath, pubring);
  const gpgSatisfied = signatureInfo.present ? signatureInfo.ok : !signatureRequired;

  let ok = bundleExists && shaSatisfied && gpgSatisfied;
  let reason: string | null = null;
  if (!bundleExists) {
    reason = 'bundle_missing';
    ok = false;
  } else if (!shaSatisfied) {
    reason = shaExpected ? 'sha_mismatch' : 'sha_missing';
    ok = false;
  } else if (!gpgSatisfied) {
    reason = signatureInfo.present ? 'gpg_invalid' : 'gpg_missing';
    ok = false;
  }

  const checkedAt = new Date().toISOString();
  const revision = resolveRevision();

  return {
    ok,
    bundlePath,
    bundleExists,
    sha256: shaActual,
    shaMatch,
    shaExpected,
    shaSource,
    signatureRequired,
    gpg: signatureInfo,
    revision,
    checkedAt,
    reason: reason ?? undefined,
  };
}

export function refreshPolicyStatus(): PolicyStatusSnapshot {
  cachedStatus = computePolicyStatus();
  return cachedStatus;
}

export function getPolicyStatus(): PolicyStatusSnapshot {
  if (!cachedStatus) {
    cachedStatus = computePolicyStatus();
  }
  return cachedStatus;
}

export function getPolicyRevision(): string | null {
  return getPolicyStatus().revision ?? null;
}
