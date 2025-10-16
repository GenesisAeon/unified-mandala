import { createHash } from 'node:crypto';

export type BoundaryVerdict = 'pass' | 'violation' | 'resolve' | 'warn' | 'error' | string;
export type BoundarySeverity = 'info' | 'ok' | 'warn' | 'error' | string;
export type BoundaryObservation = {
  ts: string | number | Date;
  source?: string;
  ruleId?: string;
  verdict: BoundaryVerdict;
  eventKey?: string;
  severity?: BoundarySeverity;
  details?: string | number | boolean | null;
};
export type BoundaryRule = {
  id?: string;
  description?: string;
  pattern?: string;
  severity?: BoundarySeverity;
  [key: string]: unknown;
};

export default class BoundaryRegistry {
  private rules: BoundaryRule[] = [];

  registerMany(rules: BoundaryRule[]): void {
    this.rules.push(...rules);
  }

  list(): BoundaryRule[] {
    return [...this.rules];
  }
}

export function stableBoundaryEventKey(input: {
  ruleId?: string;
  source?: string;
  ts?: string | number | Date;
  verdict?: BoundaryVerdict;
  payload?: unknown;
  severity?: BoundarySeverity;
  details?: unknown;
}): string {
  const raw = [
    input.ruleId ?? '',
    input.source ?? '',
    input.ts ?? '',
    input.verdict ?? '',
    input.severity ?? '',
    JSON.stringify(input.payload ?? input.details ?? null),
  ].join('|');
  return createHash('sha1').update(raw).digest('hex');
}

export function isValidBoundaryEventKey(value: unknown): value is string {
  return typeof value === 'string' && /^[a-f0-9]{40}$/i.test(value);
}
