import dns from 'node:dns/promises';
import net from 'node:net';
import { URL } from 'node:url';

type AllowPattern = {
  host: string;
  port: number | '*';
  protocols: Set<string> | null;
};

function normalizeHost(value: string): string {
  return value.trim().toLowerCase();
}

function parseAllowEntry(entry: string): AllowPattern | null {
  const trimmed = entry.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.includes('://')) {
    let candidate = trimmed;
    let wildcardPort = false;
    if (candidate.endsWith(':*')) {
      wildcardPort = true;
      candidate = candidate.replace(/:\*$/, ':0');
    }

    let parsed: URL;
    try {
      parsed = new URL(candidate);
    } catch {
      return null;
    }

    const protocol = parsed.protocol.replace(/:$/, '').toLowerCase();
    const host = normalizeHost(parsed.hostname);
    if (!host) {
      return null;
    }

    if (wildcardPort) {
      return { host, port: '*', protocols: new Set([protocol]) };
    }

    const port = parsed.port
      ? Number.parseInt(parsed.port, 10)
      : protocol === 'https'
        ? 443
        : 80;
    if (!Number.isFinite(port)) {
      return null;
    }
    return { host, port, protocols: new Set([protocol]) };
  }

  let hostPart = trimmed;
  let portPart: string | undefined;

  if (trimmed.startsWith('[')) {
    const end = trimmed.indexOf(']');
    if (end === -1) {
      return null;
    }
    hostPart = trimmed.slice(1, end);
    const rest = trimmed.slice(end + 1);
    if (rest.startsWith(':')) {
      portPart = rest.slice(1);
    } else if (rest.length > 0) {
      return null;
    }
  } else {
    const lastColon = trimmed.lastIndexOf(':');
    if (lastColon !== -1) {
      hostPart = trimmed.slice(0, lastColon);
      portPart = trimmed.slice(lastColon + 1);
    }
  }

  const host = normalizeHost(hostPart);
  if (!host) {
    return null;
  }

  if (!portPart || portPart.length === 0) {
    return { host, port: 80, protocols: null };
  }
  if (portPart === '*') {
    return { host, port: '*', protocols: null };
  }

  const parsedPort = Number.parseInt(portPart, 10);
  if (!Number.isFinite(parsedPort)) {
    return null;
  }
  return { host, port: parsedPort, protocols: null };
}

const allowlistPatterns = (process.env.VERIFY_GATE_SSRF_ALLOWLIST ?? process.env.VERIFY_GATE_UPSTREAM_ALLOWLIST ?? '127.0.0.1:4000')
  .split(',')
  .map((entry: string) => parseAllowEntry(entry))
  .filter((entry: AllowPattern | null): entry is AllowPattern => entry !== null);

const allowedProtocols = new Set(
  (process.env.VERIFY_GATE_ALLOW_PROTOCOLS ?? 'http,https')
    .split(',')
    .map((value: string) => value.trim().toLowerCase())
    .filter(Boolean),
);

function hostMatches(entryHost: string, candidateHost: string): boolean {
  if (entryHost === candidateHost) {
    return true;
  }
  if (entryHost === 'localhost' && (candidateHost === '127.0.0.1' || candidateHost === '::1')) {
    return true;
  }
  if ((entryHost === '127.0.0.1' || entryHost === '::1') && candidateHost === 'localhost') {
    return true;
  }
  return false;
}

function isAllowed(host: string, port: number, protocol: string): boolean {
  const normalizedHost = normalizeHost(host);
  for (const entry of allowlistPatterns) {
    if (entry.protocols && !entry.protocols.has(protocol)) {
      continue;
    }
    if (!hostMatches(entry.host, normalizedHost)) {
      continue;
    }
    if (entry.port === '*' || entry.port === port) {
      return true;
    }
  }
  return false;
}

export function hasAllowlistEntries(): boolean {
  return allowlistPatterns.length > 0;
}

function isPrivate(address: string): boolean {
  if (!net.isIP(address)) {
    return false;
  }

  if (address === '127.0.0.1' || address === '::1') {
    return true;
  }

  if (address.includes(':')) {
    // IPv6 private ranges – loopback already handled, treat fc00::/7 as private.
    return address.toLowerCase().startsWith('fc') || address.toLowerCase().startsWith('fd');
  }

  const parts = address.split('.').map((segment) => Number.parseInt(segment, 10));
  if (parts.length !== 4 || parts.some((segment) => Number.isNaN(segment))) {
    return false;
  }

  return (
    parts[0] === 10 ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168)
  );
}

export async function assertAllowed(target: string): Promise<void> {
  const url = new URL(target);
  const protocol = url.protocol.replace(/:$/, '').toLowerCase();
  if (!allowedProtocols.has(protocol)) {
    throw new Error('protocol_not_allowed');
  }
  const port = url.port ? Number.parseInt(url.port, 10) : protocol === 'https' ? 443 : 80;
  if (!Number.isFinite(port)) {
    throw new Error('port_not_allowed');
  }

  if (!isAllowed(url.hostname, port, protocol)) {
    throw new Error('upstream_not_allowlisted');
  }

  const addresses = await dns
    .lookup(url.hostname, { all: true, verbatim: false })
    .catch(() => [] as Array<{ address: string }>);
  if (addresses.length === 0) {
    return;
  }

  for (const entry of addresses) {
    const resolvedHost = normalizeHost(entry.address);
    if (isPrivate(entry.address) && !isAllowed(resolvedHost, port, protocol)) {
      throw new Error('upstream_private_blocked');
    }
  }
}
