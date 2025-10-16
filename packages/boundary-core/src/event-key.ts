import { createHash } from 'node:crypto';
import type { BoundaryObservation } from './types.js';

type KeyInput = Pick<BoundaryObservation, 'ruleId' | 'source' | 'ts'> & {
  verdict?: BoundaryObservation['verdict'] | string;
  payload?: unknown;
  severity?: BoundaryObservation['severity'] | string;
  details?: BoundaryObservation['details'];
};

function serialize(value: unknown): string {
  try {
    return JSON.stringify(value ?? null);
  } catch {
    return String(value ?? '');
  }
}

export function stableBoundaryEventKey(law: KeyInput): string {
  const raw = [law.ruleId, law.source, law.ts, law.verdict ?? '', law.severity ?? '', serialize(law.payload ?? law.details ?? null)]
    .map((part) => (typeof part === 'string' ? part : serialize(part)))
    .join('|');
  return createHash('sha1').update(raw).digest('hex');
}

export function isValidBoundaryEventKey(value: unknown): value is string {
  return typeof value === 'string' && /^[a-f0-9]{40}$/i.test(value);
}
