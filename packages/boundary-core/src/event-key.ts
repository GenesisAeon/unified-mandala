import { createHash } from 'node:crypto';
import type { BoundaryObservation } from './types.js';
import { canonicalizePayload } from './canonical.js';

type KeyInput = Pick<BoundaryObservation, 'ruleId' | 'source' | 'ts'> & {
  verdict?: BoundaryObservation['verdict'] | string;
  payload?: unknown;
  severity?: BoundaryObservation['severity'] | string;
  details?: BoundaryObservation['details'];
};

export function stableBoundaryEventKey(law: KeyInput): string {
  const canonicalPayload = canonicalizePayload(law.payload ?? law.details ?? null);
  const raw = [
    String(law.ruleId ?? ''),
    String(law.source ?? ''),
    String(law.ts ?? ''),
    String(law.verdict ?? ''),
    String(law.severity ?? ''),
    canonicalPayload,
  ].join('|');
  return createHash('sha1').update(raw).digest('hex');
}

export function isValidBoundaryEventKey(value: unknown): value is string {
  return typeof value === 'string' && /^[a-f0-9]{40}$/i.test(value);
}
