import client from 'prom-client';

type MethodLabel = string;
type RouteLabel = string;
type CodeLabel = string;

export const registry = new client.Registry();
client.collectDefaultMetrics({ register: registry });

export const inflightGauge = new client.Gauge({
  name: 'verify_gate_inflight',
  help: 'Number of in-flight verify-gate proxy requests',
  registers: [registry],
});

export const httpResponses = new client.Counter({
  name: 'verify_gate_http_responses_total',
  help: 'Count of HTTP responses by status code family',
  labelNames: ['code'],
  registers: [registry],
});

export const idemHits = new client.Counter({
  name: 'verify_gate_idem_hits_total',
  help: 'Duplicate or replayed requests blocked',
  registers: [registry],
});

export const ssrfBlocks = new client.Counter({
  name: 'verify_gate_ssrf_block_total',
  help: 'Requests blocked by SSRF allowlist',
  labelNames: ['host'],
  registers: [registry],
});

export const tokenFails = new client.Counter({
  name: 'verify_gate_token_fail_total',
  help: 'Upstream refused verdict token or token missing',
  labelNames: ['reason'],
  registers: [registry],
});

export const upstreamDuration = new client.Histogram({
  name: 'verify_gate_upstream_duration_ms',
  help: 'Latency to upstream (ms)',
  buckets: [50, 100, 250, 500, 1000, 2000, 5000],
  labelNames: ['method', 'route', 'code'],
  registers: [registry],
});

export function observeUpstreamDuration(method: MethodLabel, route: RouteLabel, code: CodeLabel, durationMs: number): void {
  const safeMethod = method?.toUpperCase?.() ?? 'GET';
  const safeRoute = route && route.length > 0 ? route : '/';
  const safeCode = code && code.length > 0 ? code : 'unknown';
  upstreamDuration.labels(safeMethod, safeRoute, safeCode).observe(durationMs);
}

export function startUpstreamTimer(method: MethodLabel, route: RouteLabel): (code: CodeLabel) => void {
  const start = process.hrtime.bigint();
  return (code: CodeLabel) => {
    const delta = process.hrtime.bigint() - start;
    const durationMs = Number(delta) / 1_000_000;
    observeUpstreamDuration(method, route, code, durationMs);
  };
}
