interface ParseOptions {
  allowPrivateDomains?: boolean;
}

interface ParseResult {
  domain: string | null;
  hostname: string | null;
}

function toHostname(input: string): string | null {
  try {
    const { hostname } = new URL(input);
    return hostname;
  } catch {
    return null;
  }
}

export function parse(input: string, _options?: ParseOptions): ParseResult {
  const hostname = toHostname(input);
  if (!hostname) {
    return { domain: null, hostname: null };
  }
  const normalized = hostname.replace(/^www\./i, '');
  const parts = normalized.split('.');
  const domain = parts.length >= 2 ? parts.slice(-2).join('.') : normalized;
  return { domain, hostname: normalized };
}
