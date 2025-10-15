export type BoundaryEvent = {
  ts: string;
  source: string;
  ruleId: string;
  verdict: 'violation' | 'resolve';
  severity: 'alarm' | 'ok' | 'warn';
  details?: Record<string, unknown>;
};

type Publisher = (event: BoundaryEvent) => Promise<void> | void;

let publisher: Publisher | null = null;

export function setBoundaryPublisher(fn: Publisher | null) {
  publisher = fn;
}

const endpointFromEnv = () => process.env.BOUNDARY_ENDPOINT || process.env.BOUNDARY_URL || '';

export async function publishBoundary(event: BoundaryEvent): Promise<void> {
  if (publisher) {
    await publisher(event);
    return;
  }
  const endpoint = endpointFromEnv();
  if (!endpoint) return;
  try {
    const target = new URL('/boundary/observe', endpoint).toString();
    await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ law: event }),
    });
  } catch {
    // silently ignore network errors for optional boundary reporting
  }
}
