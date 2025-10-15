export type BoundaryVerdict = 'pass' | 'violation' | 'resolve' | 'warn' | 'error' | string;
export type BoundarySeverity = 'info' | 'ok' | 'warn' | 'error' | string;
export type BoundaryObservation = {
  ts: string | number | Date;
  source?: string;
  ruleId?: string;
  verdict: BoundaryVerdict;
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
