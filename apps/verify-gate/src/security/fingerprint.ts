import { createHash } from 'node:crypto';

export function bodySha256(body: unknown): string {
  if (typeof body === 'string') {
    return createHash('sha256').update(body).digest('hex');
  }
  try {
    return createHash('sha256').update(JSON.stringify(body ?? {})).digest('hex');
  } catch {
    return createHash('sha256').update(String(body ?? '')).digest('hex');
  }
}

export type FingerprintInput = {
  reqId: string;
  method: string;
  path: string;
  bodyHash: string;
  evidenceDomains: string[];
  boundaryHits: string[];
};

export function verdictFingerprint(input: FingerprintInput): string {
  const payload = JSON.stringify({
    v: 1,
    r: input.reqId,
    m: input.method.toUpperCase(),
    p: input.path,
    b: input.bodyHash,
    d: [...new Set(input.evidenceDomains)].sort(),
    bh: [...new Set(input.boundaryHits)].sort(),
  });
  return createHash('sha256').update(payload).digest('hex');
}
