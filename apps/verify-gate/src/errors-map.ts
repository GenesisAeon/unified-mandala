import type { MetricsApi } from './metrics.js';
import {
  VerifyGateError,
  SSRFDenyError,
  DNSResolveError,
  DNSEmptyAnswerError,
  RedirectBadSchemeError,
  RedirectPrivateTargetError,
  RedirectTooManyError,
  TlsNameMismatchError,
  IpMismatchError,
  UpstreamTimeoutError,
  UpstreamBadGatewayError,
  toHttp,
} from './errors.js';

export interface ErrorMeta {
  host?: string;
}

export function recordAndMapError(err: unknown, metrics: MetricsApi, meta: ErrorMeta = {}) {
  if (err instanceof SSRFDenyError) {
    metrics.incSsrfBlock(err.message || 'deny');
  } else if (err instanceof DNSResolveError) {
    metrics.incSsrfResolve('error');
  } else if (err instanceof DNSEmptyAnswerError) {
    metrics.incSsrfResolve('empty');
  } else if (err instanceof RedirectBadSchemeError) {
    metrics.incRedirectBlock(err.code);
  } else if (err instanceof RedirectPrivateTargetError) {
    metrics.incRedirectBlock(err.code);
  } else if (err instanceof RedirectTooManyError) {
    metrics.incRedirectBlock(err.code);
  } else if (err instanceof TlsNameMismatchError) {
    metrics.incTlsNameMismatch(meta.host);
  } else if (err instanceof IpMismatchError) {
    metrics.incIpMismatch(meta.host);
  } else if (err instanceof UpstreamTimeoutError) {
    metrics.incUpstream('timeout');
  } else if (err instanceof UpstreamBadGatewayError) {
    metrics.incUpstream('bad_gateway');
  }

  const mapped = toHttp(err);
  return { status: mapped.status, code: mapped.code, message: mapped.message };
}

export function isVerifyGateError(error: unknown): error is VerifyGateError {
  return error instanceof VerifyGateError;
}
