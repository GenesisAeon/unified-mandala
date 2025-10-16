export type Severity = 'info' | 'warn' | 'error';

export interface BoundaryRule {
  id: string;
  description: string;
  severity?: Severity;
  tags?: string[];
  /** optional regex pattern to detect a law/violation */
  pattern?: string;
}

export interface BoundaryObservation {
  ts: string; // ISO
  source: string; // file/path/context
  ruleId: string;
  verdict: 'pass' | 'violation';
  eventKey: string;
  details?: string;
  severity?: Severity;
}

