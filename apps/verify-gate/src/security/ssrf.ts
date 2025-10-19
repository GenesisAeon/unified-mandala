import { Resolver } from 'node:dns/promises';
import { URL } from 'node:url';
import ipaddr from 'ipaddr.js';

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

const resolver = new Resolver();

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

function isSuspiciousLiteral(host: string): boolean {
  return /^0x/i.test(host) || /^0[0-9]/.test(host) || /\d{8,}/.test(host);
}

function parseAddress(address: string): ipaddr.IPv4 | ipaddr.IPv6 | null {
  try {
    if (address.includes(':') && !address.includes('%')) {
      return ipaddr.parse(address);
    }
    return ipaddr.parse(address);
  } catch {
    return null;
  }
}

function isBlockedAddress(address: ipaddr.IPv4 | ipaddr.IPv6): boolean {
  const range = address.range();
  if (range && ['loopback', 'linkLocal', 'uniqueLocal', 'multicast', 'unspecified', 'private'].includes(range)) {
    return true;
  }
  if (address.kind() === 'ipv4') {
    return address.match(ipaddr.parse('0.0.0.0'), 8) || address.match(ipaddr.parse('127.0.0.0'), 8);
  }
  if (address.kind() === 'ipv6') {
    return address.match(ipaddr.parse('::'), 128);
  }
  return false;
}

async function resolveHost(host: string): Promise<string[]> {
  if (isSuspiciousLiteral(host)) {
    return [host];
  }
  try {
    const answers = await resolver.resolve(host);
    if (Array.isArray(answers) && answers.length > 0) {
      return answers.map((entry) => String(entry));
    }
  } catch {}
  return [host];
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

  if (isSuspiciousLiteral(url.hostname)) {
    const err = new Error('upstream_private_blocked');
    (err as Error & { resolvedIp?: string }).resolvedIp = url.hostname;
    throw err;
  }

  if (!isAllowed(url.hostname, port, protocol)) {
    throw new Error('upstream_not_allowlisted');
  }

  const resolved = await resolveHost(url.hostname);
  for (const address of resolved) {
    const parsed = parseAddress(address.replace(/[\[\]]/g, ''));
    if (!parsed) {
      continue;
    }
    if (isBlockedAddress(parsed) && !isAllowed(parsed.toString(), port, protocol)) {
      const error = new Error('upstream_private_blocked') as Error & { resolvedIp?: string };
      error.resolvedIp = parsed.toString();
      throw error;
    }
  }
}
