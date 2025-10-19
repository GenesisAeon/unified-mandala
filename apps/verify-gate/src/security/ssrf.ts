import { lookup as dnsLookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { URL } from 'node:url';
import {
  ssrfBlocks,
  ssrfResolveEmpty,
  ssrfResolveErrors,
} from '../metrics.js';

type AllowPattern = {
  host: string;
  port: number | '*';
  protocols: Set<string> | null;
};

export class SSRFDenyError extends Error {
  public readonly code = 'SSRF_DENY';
  public readonly resolvedIp?: string;

  constructor(message: string, resolvedIp?: string) {
    super(message);
    this.name = 'SSRFDenyError';
    this.resolvedIp = resolvedIp;
  }
}

interface AllowResult {
  ip: string;
  url: URL;
  addresses: string[];
}

function normalizeHost(value: string): string {
  return value.trim().toLowerCase();
}

function stripBrackets(value: string): string {
  if (value.startsWith('[') && value.endsWith(']')) {
    return value.slice(1, -1);
  }
  return value;
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

function isSuspiciousLiteral(host: string): boolean {
  return /^0x/i.test(host) || /^0[0-9]/.test(host) || /\d{8,}/.test(host);
}

function normalizeIp(address: string): string {
  const stripped = stripBrackets(address);
  const lower = stripped.toLowerCase();
  if (lower.startsWith('::ffff:')) {
    const maybeIpv4 = stripped.slice(7);
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(maybeIpv4)) {
      return maybeIpv4;
    }
  }
  return stripped;
}

function isIpv4Address(value: string): boolean {
  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(value);
}

function isPrivateIpv4(value: string): boolean {
  if (value.startsWith('10.')) return true;
  if (value.startsWith('127.')) return true;
  if (value.startsWith('169.254.')) return true;
  if (value.startsWith('192.168.')) return true;
  if (value.startsWith('0.')) return true;
  if (value.startsWith('172.')) {
    const second = Number.parseInt(value.split('.')[1] ?? '', 10);
    if (Number.isFinite(second) && second >= 16 && second <= 31) {
      return true;
    }
  }
  if (value.startsWith('100.')) {
    const second = Number.parseInt(value.split('.')[1] ?? '', 10);
    if (Number.isFinite(second) && second >= 64 && second <= 127) {
      return true;
    }
  }
  if (value.startsWith('192.0.0.')) return true;
  if (value.startsWith('192.0.2.')) return true;
  if (value.startsWith('198.18.') || value.startsWith('198.19.')) return true;
  if (value.startsWith('198.51.100.')) return true;
  if (value.startsWith('203.0.113.')) return true;
  return value === '255.255.255.255';
}

function isPrivateIpv6(value: string): boolean {
  const lower = value.toLowerCase();
  if (lower === '::1' || lower === '::') {
    return true;
  }
  if (lower.startsWith('fc') || lower.startsWith('fd')) {
    return true;
  }
  if (lower.startsWith('fe8') || lower.startsWith('fe9') || lower.startsWith('fea') || lower.startsWith('feb')) {
    return true;
  }
  if (lower.startsWith('2001:db8:')) {
    return true;
  }
  if (lower.startsWith('::ffff:')) {
    return true;
  }
  return false;
}

function isPrivateOrLoopbackAddress(address: string): boolean {
  const normalized = normalizeIp(address);
  if (isIpv4Address(normalized)) {
    return isPrivateIpv4(normalized);
  }
  return isPrivateIpv6(normalized);
}

async function resolveHostAll(host: string): Promise<string[]> {
  const strippedHost = stripBrackets(host);
  const hostLabel = normalizeHost(strippedHost);

  if (isSuspiciousLiteral(strippedHost)) {
    throw new SSRFDenyError('upstream_private_blocked', strippedHost);
  }

  if (isIP(strippedHost)) {
    return [normalizeIp(strippedHost)];
  }

  try {
    const records = await dnsLookup(strippedHost, { all: true, verbatim: true });
    const addresses = Array.from(new Set(records.map((record) => normalizeIp(record.address))));
    if (addresses.length === 0) {
      ssrfResolveEmpty.inc({ host: hostLabel });
      throw new SSRFDenyError('dns_no_records');
    }
    return addresses;
  } catch (error) {
    if (error instanceof SSRFDenyError) {
      throw error;
    }
    ssrfResolveErrors.inc({ host: hostLabel });
    throw new SSRFDenyError('dns_resolution_failed');
  }
}

function recordBlock(host: string, message: string, resolvedIp?: string): never {
  const normalizedHost = host.trim().length > 0 ? host : 'unknown';
  ssrfBlocks.inc({ host: normalizedHost, resolved_ip: resolvedIp ?? 'unknown' });
  throw new SSRFDenyError(message, resolvedIp);
}

export async function assertAllowed(target: string): Promise<AllowResult> {
  const url = new URL(target);
  const protocol = url.protocol.replace(/:$/, '').toLowerCase();
  const host = url.hostname;
  const port = url.port ? Number.parseInt(url.port, 10) : protocol === 'https' ? 443 : 80;

  if (!allowedProtocols.has(protocol)) {
    return recordBlock(host, 'protocol_not_allowed');
  }

  if (!Number.isFinite(port)) {
    return recordBlock(host, 'port_not_allowed');
  }

  if (isSuspiciousLiteral(host)) {
    return recordBlock(host, 'upstream_private_blocked', host);
  }

  if (!isAllowed(host, port, protocol)) {
    return recordBlock(host, 'upstream_not_allowlisted');
  }

  let addresses: string[];
  try {
    addresses = await resolveHostAll(host);
  } catch (error) {
    if (error instanceof SSRFDenyError) {
      ssrfBlocks.inc({ host, resolved_ip: error.resolvedIp ?? 'unknown' });
    }
    throw error;
  }

  for (const address of addresses) {
    const normalizedAddress = normalizeIp(address);
    if (isPrivateOrLoopbackAddress(normalizedAddress) && !isAllowed(normalizedAddress, port, protocol)) {
      return recordBlock(host, 'upstream_private_blocked', normalizedAddress);
    }
  }

  return { ip: addresses[0], url, addresses };
}
