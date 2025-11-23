import {
  isValidBoundaryEventKey,
  stableBoundaryEventKey,
} from '../../packages/boundary-core/src/event-key.js';

export type BoundaryEvent = {
  ts: string;
  source: string;
  ruleId: string;
  verdict: 'violation' | 'resolve' | 'pass';
  severity: 'alarm' | 'ok' | 'warn';
  details?: Record<string, unknown>;
  payload?: unknown;
  eventKey?: string;
};

type Publisher = (event: BoundaryEvent) => Promise<void> | void;

let publisher: Publisher | null = null;

export function setBoundaryPublisher(fn: Publisher | null) {
  publisher = fn;
}

const endpointFromEnv = () => process.env.BOUNDARY_ENDPOINT || process.env.BOUNDARY_URL || '';

export async function publishBoundary(event: BoundaryEvent): Promise<void> {
  const enriched: BoundaryEvent = { ...event };
  if (!isValidBoundaryEventKey(enriched.eventKey)) {
    enriched.eventKey = stableBoundaryEventKey({
      ruleId: enriched.ruleId,
      source: enriched.source,
      ts: enriched.ts,
      verdict: enriched.verdict,
      severity: enriched.severity,
      payload: enriched.payload ?? enriched.details,
    });
  }

  if (publisher) {
    await publisher(enriched);
    return;
  }
  const endpoint = endpointFromEnv();
  if (!endpoint) return;
  try {
    const target = new URL('/boundary/observe', endpoint).toString();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (isValidBoundaryEventKey(enriched.eventKey)) {
      headers['Idempotency-Key'] = enriched.eventKey!;
    }
    await fetch(target, {
      method: 'POST',
      headers,
      body: JSON.stringify({ law: enriched }),
    });
  } catch {
    // silently ignore network errors for optional boundary reporting
  }
}
