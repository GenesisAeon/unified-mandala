import { Counter, Gauge, Histogram, Registry, collectDefaultMetrics } from 'prom-client';

type MethodLabel = string;
type RouteLabel = string;
type CodeLabel = string;

export type MetricsApi = {
  registry: Registry;
  inflightGauge: Gauge<string>;
  httpResponses: Counter<'code'>;
  idemHits: Counter<string>;
  ssrfBlocks: Counter<'host' | 'resolved_ip'>;
  ssrfResolveErrors: Counter<'host'>;
  ssrfResolveEmpty: Counter<'host'>;
  ssrfBlockReasons: Counter<'reason'>;
  ssrfResolveReasons: Counter<'kind'>;
  dnsTtl: Histogram<'host'>;
  redirectFollow: Counter<'hops' | 'start_host'>;
  redirectBlock: Counter<'code' | 'start_host'>;
  ipMismatch: Counter<'host'>;
  tlsNameMismatch: Counter<'host'>;
  upstreamErrors: Counter<'reason'>;
  tokenFails: Counter<'reason'>;
  rateLimitBlocks: Counter<'scope'>;
  upstreamDuration: Histogram<'method' | 'route' | 'code'>;
  observeUpstreamDuration(method: MethodLabel, route: RouteLabel, code: CodeLabel, durationMs: number): void;
  startUpstreamTimer(method: MethodLabel, route: RouteLabel): (code: CodeLabel) => void;
  observeTtl(host: string, ttlSeconds: number): void;
  incRedirectBlock(code: string, startHost?: string): void;
  incIpMismatch(host?: string): void;
  incTlsNameMismatch(host?: string): void;
  incResolveError(host: string): void;
  incResolveEmpty(host: string): void;
  incSsrfBlock(reason: string): void;
  incSsrfResolve(kind: 'error' | 'empty'): void;
  incUpstream(reason: string): void;
};

let singleton: MetricsApi | null = null;

function buildMetrics(customRegistry?: Registry): MetricsApi {
  const registry = customRegistry ?? new Registry();
  collectDefaultMetrics({ register: registry });

  const inflightGauge = new Gauge({
    name: 'verify_gate_inflight',
    help: 'Number of in-flight verify-gate proxy requests',
    registers: [registry],
  });

  const httpResponses = new Counter({
    name: 'verify_gate_http_responses_total',
    help: 'Count of HTTP responses by status code family',
    labelNames: ['code'],
    registers: [registry],
  });

  const idemHits = new Counter({
    name: 'verify_gate_idem_hits_total',
    help: 'Duplicate or replayed requests blocked',
    registers: [registry],
  });

  const ssrfBlocks = new Counter({
    name: 'verify_gate_ssrf_block_total',
    help: 'Requests blocked by SSRF allowlist',
    labelNames: ['host', 'resolved_ip'],
    registers: [registry],
  });

  const ssrfResolveErrors = new Counter({
    name: 'verify_gate_ssrf_resolve_error_total',
    help: 'DNS resolution errors while evaluating SSRF allowlist entries',
    labelNames: ['host'],
    registers: [registry],
  });

  const ssrfResolveEmpty = new Counter({
    name: 'verify_gate_ssrf_resolve_empty_total',
    help: 'Empty DNS A/AAAA resolution results for SSRF allowlist entries',
    labelNames: ['host'],
    registers: [registry],
  });

  const ssrfBlockReasons = new Counter({
    name: 'verify_gate_ssrf_block_reason_total',
    help: 'Reason for SSRF blocks mapped from typed errors',
    labelNames: ['reason'],
    registers: [registry],
  });

  const ssrfResolveReasons = new Counter({
    name: 'verify_gate_ssrf_resolve_reason_total',
    help: 'Reason for SSRF DNS resolution issues mapped from typed errors',
    labelNames: ['kind'],
    registers: [registry],
  });

  const dnsTtl = new Histogram({
    name: 'verify_gate_dns_ttl_pinned_seconds',
    help: 'Authoritative DNS TTL (seconds) used to bound keep-alive for pinned upstreams',
    buckets: [1, 5, 10, 20, 30, 60, 120, 300, 600, 1800, 3600],
    labelNames: ['host'],
    registers: [registry],
  });

  const redirectFollow = new Counter({
    name: 'verify_gate_redirect_follow_total',
    help: 'Redirects successfully followed before proxying',
    labelNames: ['hops', 'start_host'],
    registers: [registry],
  });

  const redirectBlock = new Counter({
    name: 'verify_gate_redirect_block_total',
    help: 'Redirect chains blocked due to policy or scheme',
    labelNames: ['code', 'start_host'],
    registers: [registry],
  });

  const ipMismatch = new Counter({
    name: 'verify_gate_ip_mismatch_total',
    help: 'Pinned IP did not match connected remote',
    labelNames: ['host'],
    registers: [registry],
  });

  const tlsNameMismatch = new Counter({
    name: 'verify_gate_tls_name_mismatch_total',
    help: 'TLS SAN validation failed for pinned request',
    labelNames: ['host'],
    registers: [registry],
  });

  const upstreamErrors = new Counter({
    name: 'verify_gate_upstream_error_total',
    help: 'Upstream failures classified by reason',
    labelNames: ['reason'],
    registers: [registry],
  });

  const tokenFails = new Counter({
    name: 'verify_gate_token_fail_total',
    help: 'Upstream refused verdict token or token missing',
    labelNames: ['reason'],
    registers: [registry],
  });

  const rateLimitBlocks = new Counter({
    name: 'verify_gate_rate_limit_total',
    help: 'Requests blocked due to rate limits',
    labelNames: ['scope'],
    registers: [registry],
  });

  const upstreamDuration = new Histogram({
    name: 'verify_gate_upstream_duration_ms',
    help: 'Latency to upstream (ms)',
    buckets: [50, 100, 200, 400, 800, 1600, 3200, 6400],
    labelNames: ['method', 'route', 'code'],
    registers: [registry],
  });

  const observeUpstreamDuration = (method: MethodLabel, route: RouteLabel, code: CodeLabel, durationMs: number) => {
    const safeMethod = method?.toUpperCase?.() ?? 'GET';
    const safeRoute = route && route.length > 0 ? route : '/';
    const safeCode = code && code.length > 0 ? code : 'unknown';
    upstreamDuration.labels(safeMethod, safeRoute, safeCode).observe(durationMs);
  };

  const startUpstreamTimer = (method: MethodLabel, route: RouteLabel) => {
    const start = process.hrtime.bigint();
    return (code: CodeLabel) => {
      const delta = process.hrtime.bigint() - start;
      const durationMs = Number(delta) / 1_000_000;
      observeUpstreamDuration(method, route, code, durationMs);
    };
  };

  const api: MetricsApi = {
    registry,
    inflightGauge,
    httpResponses,
    idemHits,
    ssrfBlocks,
    ssrfResolveErrors,
    ssrfResolveEmpty,
    ssrfBlockReasons,
    ssrfResolveReasons,
    dnsTtl,
    redirectFollow,
    redirectBlock,
    ipMismatch,
    tlsNameMismatch,
    upstreamErrors,
    tokenFails,
    rateLimitBlocks,
    upstreamDuration,
    observeUpstreamDuration,
    startUpstreamTimer,
    observeTtl: (host, ttlSeconds) => dnsTtl.labels(host).observe(ttlSeconds),
    incRedirectBlock: (code, startHost) => redirectBlock.inc({ code, start_host: startHost ?? 'unknown' }),
    incIpMismatch: (host) => ipMismatch.inc({ host: host ?? 'unknown' }),
    incTlsNameMismatch: (host) => tlsNameMismatch.inc({ host: host ?? 'unknown' }),
    incResolveError: (host) => ssrfResolveErrors.inc({ host }),
    incResolveEmpty: (host) => ssrfResolveEmpty.inc({ host }),
    incSsrfBlock: (reason) => ssrfBlockReasons.inc({ reason }),
    incSsrfResolve: (kind) => ssrfResolveReasons.inc({ kind }),
    incUpstream: (reason) => upstreamErrors.inc({ reason }),
  };

  return api;
}

export function configureMetrics(customRegistry?: Registry): MetricsApi {
  if (!customRegistry && singleton) {
    return singleton;
  }
  const api = buildMetrics(customRegistry);
  if (!customRegistry) {
    singleton = api;
  }
  return api;
}

export let metrics = configureMetrics();

export function setMetrics(api: MetricsApi): void {
  metrics = api;
  registry = api.registry;
  inflightGauge = api.inflightGauge;
  httpResponses = api.httpResponses;
  idemHits = api.idemHits;
  ssrfBlocks = api.ssrfBlocks;
  ssrfResolveErrors = api.ssrfResolveErrors;
  ssrfResolveEmpty = api.ssrfResolveEmpty;
  ssrfBlockReasons = api.ssrfBlockReasons;
  ssrfResolveReasons = api.ssrfResolveReasons;
  dnsTtl = api.dnsTtl;
  redirectFollow = api.redirectFollow;
  redirectBlock = api.redirectBlock;
  ipMismatch = api.ipMismatch;
  tlsNameMismatch = api.tlsNameMismatch;
  upstreamErrors = api.upstreamErrors;
  tokenFails = api.tokenFails;
  rateLimitBlocks = api.rateLimitBlocks;
  upstreamDuration = api.upstreamDuration;
  observeUpstreamDuration = api.observeUpstreamDuration;
  startUpstreamTimer = api.startUpstreamTimer;
  observeTtl = api.observeTtl;
  incRedirectBlock = api.incRedirectBlock;
  incIpMismatch = api.incIpMismatch;
  incTlsNameMismatch = api.incTlsNameMismatch;
  incResolveError = api.incResolveError;
  incResolveEmpty = api.incResolveEmpty;
  incSsrfBlock = api.incSsrfBlock;
  incSsrfResolve = api.incSsrfResolve;
  incUpstream = api.incUpstream;
}

export let {
  registry,
  inflightGauge,
  httpResponses,
  idemHits,
  ssrfBlocks,
  ssrfResolveErrors,
  ssrfResolveEmpty,
  ssrfBlockReasons,
  ssrfResolveReasons,
  dnsTtl,
  redirectFollow,
  redirectBlock,
  ipMismatch,
  tlsNameMismatch,
  upstreamErrors,
  tokenFails,
  rateLimitBlocks,
  upstreamDuration,
  observeUpstreamDuration,
  startUpstreamTimer,
  observeTtl,
  incRedirectBlock,
  incIpMismatch,
  incTlsNameMismatch,
  incResolveError,
  incResolveEmpty,
  incSsrfBlock,
  incSsrfResolve,
  incUpstream,
} = metrics;
