import { CircuitBreaker } from './circuit-breaker.js';
import { fetchJson, type JsonResult } from './http-client.js';

export interface BoundaryViolation {
  ruleId?: string;
  severity?: string;
  [key: string]: unknown;
}

export interface BoundaryResponse {
  violations?: BoundaryViolation[];
  [key: string]: unknown;
}

export interface BoundaryClientConfig {
  timeoutMs?: number;
  retries?: number;
  failureThreshold?: number;
  halfOpenAfterMs?: number;
  successReset?: number;
}

const breaker = new CircuitBreaker();

export function configureBoundaryCircuit(options: BoundaryClientConfig = {}): void {
  const next: BoundaryClientConfig = {};
  if (options.failureThreshold !== undefined) {
    next.failureThreshold = options.failureThreshold;
  }
  if (options.halfOpenAfterMs !== undefined) {
    next.halfOpenAfterMs = options.halfOpenAfterMs;
  }
  if (options.successReset !== undefined) {
    next.successReset = options.successReset;
  }
  breaker.configure(next);
}

export function getBoundaryCircuitState(): ReturnType<CircuitBreaker['getState']> {
  return breaker.getState();
}

export async function observeBoundary(
  baseUrl: string,
  text: string,
  context: unknown,
  config: BoundaryClientConfig = {},
): Promise<JsonResult<BoundaryResponse>> {
  if (!breaker.canRequest()) {
    return { ok: false, status: null, error: 'CB_OPEN' };
  }

  const timeoutMs = config.timeoutMs ?? Number.parseInt(process.env.BOUNDARY_TIMEOUT_MS ?? '1500', 10);
  const retries = config.retries ?? Number.parseInt(process.env.BOUNDARY_RETRIES ?? '2', 10);

  const result = await fetchJson<BoundaryResponse>(`${baseUrl}/boundary/observe`, {
    method: 'POST',
    body: { text, context },
    timeoutMs,
    retries,
  });

  if (result.ok) {
    breaker.onSuccess();
  } else {
    breaker.onFailure();
  }

  return result;
}
