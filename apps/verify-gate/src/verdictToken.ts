import jwt from 'jsonwebtoken';

export type VerdictClaims = {
  v: 'green' | 'yellow' | 'red';
  ec: number;
  rid: string;
  pth: string;
  exp: number;
};

function getSecret(): string {
  const secret = process.env.VERIFY_GATE_JWT_SECRET;
  if (!secret) {
    throw new Error('VERIFY_GATE_JWT_SECRET is required to sign verdict tokens');
  }
  return secret;
}

export function signVerdict(claims: VerdictClaims): string {
  return jwt.sign(claims, getSecret(), { algorithm: 'HS256', noTimestamp: true });
}
