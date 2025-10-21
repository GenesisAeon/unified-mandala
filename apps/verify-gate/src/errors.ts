/* eslint-disable max-classes-per-file */

export abstract class VerifyGateError extends Error {
  public abstract code: string;

  public status?: number;

  protected constructor(message: string, status?: number) {
    super(message);
    this.name = new.target.name;
    this.status = status;
  }
}

export class SSRFDenyError extends VerifyGateError {
  public code = 'SSRF_DENY';

  public readonly resolvedIp?: string;

  constructor(message = 'Target not allowed', resolvedIp?: string, status = 403) {
    super(message, status);
    this.resolvedIp = resolvedIp;
  }
}

export class DNSResolveError extends VerifyGateError {
  public code = 'DNS_RESOLVE_ERROR';

  constructor(message = 'DNS resolution failed') {
    super(message, 502);
  }
}

export class DNSEmptyAnswerError extends VerifyGateError {
  public code = 'DNS_EMPTY_ANSWER';

  constructor(message = 'No usable DNS records') {
    super(message, 502);
  }
}

export class RedirectBadSchemeError extends VerifyGateError {
  public code = 'REDIRECT_BAD_SCHEME';

  constructor(message = 'Redirect to unsupported scheme') {
    super(message, 400);
  }
}

export class RedirectPrivateTargetError extends VerifyGateError {
  public code = 'REDIRECT_PRIVATE_TARGET';

  constructor(message = 'Redirect to private or blocked address') {
    super(message, 403);
  }
}

export class RedirectTooManyError extends VerifyGateError {
  public code = 'REDIRECT_TOO_MANY';

  constructor(message = 'Too many redirects') {
    super(message, 400);
  }
}

export class TlsNameMismatchError extends VerifyGateError {
  public code = 'TLS_NAME_MISMATCH';

  constructor(message = 'TLS SAN/hostname mismatch') {
    super(message, 502);
  }
}

export class IpMismatchError extends VerifyGateError {
  public code = 'IP_MISMATCH';

  constructor(message = 'Socket remote IP mismatch') {
    super(message, 502);
  }
}

export class UpstreamTimeoutError extends VerifyGateError {
  public code = 'UPSTREAM_TIMEOUT';

  constructor(message = 'Upstream timeout') {
    super(message, 504);
  }
}

export class UpstreamBadGatewayError extends VerifyGateError {
  public code = 'UPSTREAM_BAD_GATEWAY';

  constructor(message = 'Upstream error') {
    super(message, 502);
  }
}

export class UnknownUpstreamError extends VerifyGateError {
  public code = 'UNKNOWN_UPSTREAM';

  constructor(message = 'Unknown upstream error') {
    super(message, 502);
  }
}

export function toHttp(err: unknown): { status: number; code: string; message: string } {
  if (err instanceof VerifyGateError) {
    return { status: err.status ?? 502, code: err.code, message: err.message };
  }
  const message = err instanceof Error ? err.message : String(err ?? 'unknown error');
  return { status: 502, code: 'UNKNOWN', message };
}
