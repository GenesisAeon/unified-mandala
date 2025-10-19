import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

type VerdictClaims = {
  v: 'green' | 'yellow' | 'red';
  ec: number;
  rid: string;
  pth: string;
  exp: number;
};

function sha1(value: string): string {
  const hash = crypto.createHash('sha1');
  hash.update(value);
  return hash.digest('hex');
}

type SecretStore = { map: Map<string, Buffer>; fallback?: string };

function parseSecrets(): SecretStore {
  const raw = process.env.VERIFY_GATE_JWT_SECRETS;
  const map = new Map<string, Buffer>();
  if (raw) {
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
  }
  const fallback = process.env.VERIFY_GATE_JWT_SECRET;
  return { map, fallback };
}

function getSecretForKid(kid?: string): Buffer | string {
  const { map, fallback } = parseSecrets();
  if (kid && map.has(kid)) {
    return map.get(kid)!;
  }
  if (!kid && map.size > 0) {
    return map.values().next().value as Buffer;
  }
  if (map.size > 0 && fallback) {
    return fallback;
  }
  if (fallback) {
    return fallback;
  }
  if (map.size > 0) {
    return map.values().next().value as Buffer;
  }
  throw new Error('VERIFY_GATE_JWT_SECRETS or VERIFY_GATE_JWT_SECRET missing for upstream verification');
}

export function verifyEthics(req: Request, res: Response, next: NextFunction): void {
  const degradedHeader = req.headers['x-verify-degraded'];
  if (typeof degradedHeader === 'string' && degradedHeader.trim().length > 0) {
    res.setHeader('x-verify-degraded', degradedHeader.trim());
  } else if (Array.isArray(degradedHeader) && degradedHeader.length > 0) {
    const value = degradedHeader.find((entry) => typeof entry === 'string' && entry.trim().length > 0);
    if (value) {
      res.setHeader('x-verify-degraded', value.trim());
    }
  }

  const tokenHeader = req.headers['x-ethics-token'];
  if (!tokenHeader) {
    res.status(428).json({ ok: false, reason: 'missing_ethics_token' });
    return;
  }

  try {
    const token = String(tokenHeader);
    const decoded = jwt.decode(token, { complete: true }) as { header?: { kid?: string } } | null;
    const kid = decoded?.header?.kid;
    const claims = jwt.verify(token, getSecretForKid(kid), {
      algorithms: ['HS256'],
      clockTolerance: 5,
    }) as VerdictClaims;
    const wantHash = sha1(`${(req.method ?? 'GET').toUpperCase()}:${req.path}`);
    if (claims.v !== 'green' || claims.pth !== wantHash || typeof claims.ec !== 'number') {
      throw new Error('not_green_or_mismatch');
    }
    res.setHeader('x-ethics-verdict', 'green');
    res.setHeader('x-ethics-evidence-count', String(claims.ec));
    next();
  } catch (error) {
    res.status(428).json({ ok: false, reason: 'ethics_verification_failed', detail: String((error as Error).message ?? error) });
  }
}
