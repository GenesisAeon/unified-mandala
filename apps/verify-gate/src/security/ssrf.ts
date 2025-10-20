import { URL } from 'node:url';
import {
  ssrfBlocks,
  ssrfResolveEmpty,
  ssrfResolveErrors,
} from '../metrics.js';
import { SSRFDNSResolveError, SSRFDNSEmptyError, SSRFPrivateTargetError, type ResolveResult } from './resolve.js';
import { resolveWithCache } from './dnsCache.js';
import { isPrivateOrBlocked, normalizeIp } from './ipRanges.js';

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

export interface AllowResult {
  ip: string;
  ips: string[];
  minTTLsec: number;
  chain: string[];
  hostname: string;
  url: URL;
}

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

const FALLBACK_TTL_SEC = Number.parseInt(process.env.VERIFY_GATE_TTL_FALLBACK_SEC ?? '30', 10);

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

  if (!isAllowed(host, port, protocol)) {
    return recordBlock(host, 'upstream_not_allowlisted');
  }

  const literalCandidate = host.replace(/^\[|\]$/g, '');
  const isLiteralIp = /^[0-9.]+$/.test(literalCandidate) || /^[0-9a-f:.]+$/i.test(literalCandidate);
  if (isLiteralIp) {
    const normalizedLiteral = normalizeIp(literalCandidate);
    if (isPrivateOrBlocked(normalizedLiteral) && !isAllowed(normalizedLiteral, port, protocol)) {
      return recordBlock(host, 'upstream_private_blocked', normalizedLiteral);
    }
    return {
      ip: normalizedLiteral,
      ips: [normalizedLiteral],
      minTTLsec: FALLBACK_TTL_SEC,
      chain: [normalizedLiteral],
      hostname: normalizedLiteral,
      url,
    };
  }

  let resolved: ResolveResult;
  try {
    resolved = await resolveWithCache(host);
  } catch (error) {
    if (error instanceof SSRFPrivateTargetError || (error as { code?: string }).code === 'SSRFPrivateTargetError') {
      ssrfBlocks.inc({ host, resolved_ip: (error as SSRFPrivateTargetError & { resolvedIp?: string }).resolvedIp ?? 'unknown' });
      throw new SSRFDenyError('upstream_private_blocked');
    }
    if (error instanceof SSRFDNSEmptyError || (error as { code?: string }).code === 'SSRFDNSEmptyError') {
      ssrfResolveEmpty.inc({ host });
      throw new SSRFDenyError('dns_no_records');
    }
    if (error instanceof SSRFDNSResolveError || (error as { code?: string }).code === 'SSRFDNSResolveError') {
      ssrfResolveErrors.inc({ host });
      throw new SSRFDenyError('dns_resolution_failed');
    }
    throw error;
  }

  const firstIp = resolved.ips[0];
  if (!firstIp) {
    return recordBlock(host, 'dns_no_records');
  }

  for (const ip of resolved.ips) {
    if (isPrivateOrBlocked(ip) && !isAllowed(ip, port, protocol)) {
      return recordBlock(host, 'upstream_private_blocked', ip);
    }
  }

  return {
    ip: normalizeIp(firstIp),
    ips: resolved.ips,
    minTTLsec: resolved.minTTLsec,
    chain: resolved.chain,
    hostname: resolved.hostnameASCII,
    url,
  };
}
