import jwt from 'jsonwebtoken';

export type VerdictClaims = {
  v: 'green' | 'yellow' | 'red';
  ec: number;
  rid: string;
  pth: string;
  exp: number;
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

export function signVerdict(claims: VerdictClaims): string {
  const { kid, secret } = resolveActiveSecret();
  const options: jwt.SignOptions = { algorithm: 'HS256', noTimestamp: true };
  if (kid) {
    options.header = { kid, alg: 'HS256', typ: 'JWT' };
  }
  return jwt.sign(claims, secret, options);
}
