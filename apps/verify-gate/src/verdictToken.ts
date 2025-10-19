import jwt from 'jsonwebtoken';

export type SignedVerdictClaims = {
  iss: 'verify-gate';
  sub: string;
  aud: string;
  v: 'green' | 'yellow' | 'red';
  ec: number;
  rid: string;
  pth: string;
  fp: string;
  ch: string;
  ed?: string[];
  bh?: string[];
  degraded?: number;
  jti: string;
  iat: number;
  exp: number;
};

export type SignVerdictInput = {
  subject: string;
  audience: string;
  verdict: 'green' | 'yellow' | 'red';
  evidenceCount: number;
  requestId: string;
  pathHash: string;
  fingerprint: string;
  contentHash: string;
  evidenceDomains: string[];
  boundaryHits: string[];
  degraded: boolean;
  ttlSeconds: number;
  jti: string;
};

type SecretEntry = { kid?: string; secret: Buffer | string };

function parseSecretEntries(raw: string | undefined): Map<string, Buffer> {
  const map = new Map<string, Buffer>();
  if (!raw) {
    return map;
  }
  for (const entry of raw.split(',').map((piece) => piece.trim()).filter(Boolean)) {
    const [kid, secret] = entry.split(':');
    if (!kid || !secret) {
      continue;
    }
    try {
      map.set(kid, Buffer.from(secret, 'base64'));
    } catch {
      continue;
    }
  }
  return map;
}

function resolveActiveSecret(): SecretEntry {
  const entries = parseSecretEntries(process.env.VERIFY_GATE_JWT_SECRETS);
  if (entries.size > 0) {
    const requestedKid = process.env.VERIFY_GATE_JWT_ACTIVE_KID;
    if (requestedKid && entries.has(requestedKid)) {
      return { kid: requestedKid, secret: entries.get(requestedKid)! };
    }
    const [firstKid, firstSecret] = entries.entries().next().value as [string, Buffer];
    return { kid: firstKid, secret: firstSecret };
  }

  const fallback = process.env.VERIFY_GATE_JWT_SECRET;
  if (fallback) {
    return { secret: fallback };
  }
  throw new Error('VERIFY_GATE_JWT_SECRETS or VERIFY_GATE_JWT_SECRET is required to sign verdict tokens');
}

export function signVerdict(payload: SignVerdictInput): { token: string; claims: SignedVerdictClaims } {
  const { kid, secret } = resolveActiveSecret();
  const nowSeconds = Math.floor(Date.now() / 1000);
  const claims: SignedVerdictClaims = {
    iss: 'verify-gate',
    sub: payload.subject,
    aud: payload.audience,
    v: payload.verdict,
    ec: payload.evidenceCount,
    rid: payload.requestId,
    pth: payload.pathHash,
    fp: payload.fingerprint,
    ch: payload.contentHash,
    ed: payload.evidenceDomains.length ? [...new Set(payload.evidenceDomains)].sort() : undefined,
    bh: payload.boundaryHits.length ? [...new Set(payload.boundaryHits)].sort() : undefined,
    degraded: payload.degraded ? 1 : undefined,
    jti: payload.jti,
    iat: nowSeconds,
    exp: nowSeconds + Math.max(payload.ttlSeconds, 1),
  };
  const options: jwt.SignOptions = { algorithm: 'HS256', noTimestamp: true };
  if (kid) {
    options.header = { kid, alg: 'HS256', typ: 'JWT' };
  }
  return { token: jwt.sign(claims, secret, options), claims };
}
