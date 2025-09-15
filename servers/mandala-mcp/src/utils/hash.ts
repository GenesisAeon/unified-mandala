import crypto from 'node:crypto';

export function hashObject(value: unknown): string {
  const normalized = typeof value === 'string' ? value : JSON.stringify(value ?? {});
  return crypto.createHash('sha256').update(normalized).digest('hex');
}
