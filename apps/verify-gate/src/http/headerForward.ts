import type { Request } from 'express';

const DROP_INBOUND = new Set([
  'connection',
  'keep-alive',
  'transfer-encoding',
  'upgrade',
  'trailer',
  'content-length',
  'host',
  'via',
  'x-forwarded-host',
  'x-ethics-verdict',
  'x-ethics-evidence-count',
  'x-verify-degraded',
  'x-verify-network',
  'traceparent',
  'tracestate',
]);

const SAFE_FORWARD = new Set([
  'authorization',
  'cookie',
  'user-agent',
  'accept',
  'accept-language',
  'content-type',
  'x-request-id',
  'x-forwarded-for',
  'x-forwarded-proto',
  'x-ethics-token',
]);

const ALLOW_RESPONSE_EXPOSE = [
  'x-ethics-verdict',
  'x-ethics-evidence-count',
  'x-request-id',
  'x-verify-degraded',
  'x-verify-network',
];

export function buildUpstreamHeaders(
  req: import('express').Request,
  overrideHost?: string,
): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers ?? {})) {
    if (!value) {
      continue;
    }
    const lower = key.toLowerCase();
    if (DROP_INBOUND.has(lower)) {
      continue;
    }
    if (!SAFE_FORWARD.has(lower)) {
      continue;
    }
    const normalized = Array.isArray(value) ? value.join(',') : String(value);
    headers.set(lower, normalized);
  }

  if (!headers.has('x-forwarded-for')) {
    const forwardedFor = [req.headers['x-forwarded-for'], req.ip].filter(Boolean).join(', ');
    if (forwardedFor) {
      headers.set('x-forwarded-for', forwardedFor);
    }
  }

  if (!headers.has('x-forwarded-proto')) {
    headers.set('x-forwarded-proto', req.secure ? 'https' : req.protocol ?? 'http');
  }

  const hostHeader = req.get('host');
  if (hostHeader && !headers.has('x-forwarded-host')) {
    headers.set('x-forwarded-host', hostHeader);
  }

  if (!headers.has('x-request-id')) {
    const requestId = (req as Request & { id?: string }).id ?? req.get('x-request-id');
    if (requestId) {
      headers.set('x-request-id', requestId);
    }
  }

  if (!headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  if (overrideHost) {
    headers.set('host', overrideHost);
  }

  return headers;
}

export function exposeEthicsHeaders(res: import('express').Response): void {
  const existing = res.getHeader('Access-Control-Expose-Headers');
  const expose = new Set<string>();
  if (typeof existing === 'string') {
    existing
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
      .forEach((value) => expose.add(value));
  } else if (Array.isArray(existing)) {
    for (const value of existing) {
      if (typeof value === 'string') {
        value
          .split(',')
          .map((segment) => segment.trim())
          .filter(Boolean)
          .forEach((segment) => expose.add(segment));
      }
    }
  }

  for (const header of ALLOW_RESPONSE_EXPOSE) {
    expose.add(header);
  }

  res.setHeader('Access-Control-Expose-Headers', Array.from(expose).join(', '));
}
