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

function getSecret(): string {
  const secret = process.env.VERIFY_GATE_JWT_SECRET;
  if (!secret) {
    throw new Error('VERIFY_GATE_JWT_SECRET missing for upstream verification');
  }
  return secret;
}

export function verifyEthics(req: Request, res: Response, next: NextFunction): void {
  const tokenHeader = req.headers['x-ethics-token'];
  if (!tokenHeader) {
    res.status(428).json({ ok: false, reason: 'missing_ethics_token' });
    return;
  }

  try {
    const claims = jwt.verify(String(tokenHeader), getSecret(), {
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
