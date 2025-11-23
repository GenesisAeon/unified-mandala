import dns from 'node:dns/promises';
import * as punycode from 'node:punycode';
import { isPrivateOrBlocked, normalizeIp } from './ipRanges.js';

export type ResolveResult = {
  ips: string[];
  minTTLsec: number;
  chain: string[];
  hostnameASCII: string;
};

const FALLBACK_TTL_SEC = Number.parseInt(process.env.VERIFY_GATE_TTL_FALLBACK_SEC ?? '30', 10);
const MAX_CNAME_HOPS = Number.parseInt(process.env.VERIFY_GATE_DNS_MAX_CNAME ?? '5', 10);
type ResolverLike = {
  resolve4: (hostname: string, options: { ttl: true }) => Promise<Array<{ address: string; ttl: number }>>;
  resolve6: (hostname: string, options: { ttl: true }) => Promise<Array<{ address: string; ttl: number }>>;
  resolveCname: (hostname: string) => Promise<string[]>;
};

function createResolver(): ResolverLike {
  const candidate = (dns as unknown as { Resolver?: new () => ResolverLike }).Resolver;
  if (typeof candidate === 'function') {
    return new candidate();
  }
  return {
    resolve4: (((dns as unknown as ResolverLike).resolve4?.bind?.(dns) ?? (async () => [])) as ResolverLike['resolve4']),
    resolve6: (((dns as unknown as ResolverLike).resolve6?.bind?.(dns) ?? (async () => [])) as ResolverLike['resolve6']),
    resolveCname: (((dns as unknown as ResolverLike).resolveCname?.bind?.(dns) ?? (async () => [])) as ResolverLike['resolveCname']),
  };
}

const resolver = createResolver();

export class SSRFDNSResolveError extends Error {
  public readonly code = 'SSRFDNSResolveError' as const;

  constructor(message: string) {
    super(message);
    this.name = 'SSRFDNSResolveError';
  }
}

export class SSRFDNSEmptyError extends Error {
  public readonly code = 'SSRFDNSEmptyError' as const;

  constructor(message: string) {
    super(message);
    this.name = 'SSRFDNSEmptyError';
  }
}

export class SSRFPrivateTargetError extends Error {
  public readonly code = 'SSRFPrivateTargetError' as const;
  public readonly resolvedIp?: string;

  constructor(message: string, resolvedIp?: string) {
    super(message);
    this.name = 'SSRFPrivateTargetError';
    this.resolvedIp = resolvedIp;
  }
}

function isIpLiteral(value: string): boolean {
  return /^[0-9.]+$/.test(value) || /^\[?[0-9a-f:.]+\]?$/i.test(value);
}

export async function resolveHostStrictTTL(hostname: string): Promise<ResolveResult> {
  const trimmed = hostname.trim();
  if (trimmed.length === 0) {
    throw new SSRFDNSResolveError('empty_hostname');
  }

  if (isIpLiteral(trimmed)) {
    const literal = trimmed.replace(/^\[|\]$/g, '');
    if (isPrivateOrBlocked(literal)) {
      throw new SSRFPrivateTargetError(`private ip literal: ${literal}`, literal);
    }
    return {
      ips: [normalizeIp(literal)],
      minTTLsec: FALLBACK_TTL_SEC,
      chain: [literal],
      hostnameASCII: literal,
    };
  }

  let current = punycode.toASCII(trimmed);
  const chain = [current];

  for (let i = 0; i < MAX_CNAME_HOPS; i += 1) {
    try {
      const cnames = await resolver.resolveCname(current);
      if (!cnames || cnames.length === 0) {
        break;
      }
      current = punycode.toASCII(cnames[0]);
      chain.push(current);
    } catch (error) {
      const code = (error as { code?: string } | null)?.code;
      if (code === 'ENODATA' || code === 'ENOTFOUND' || code === 'ENOTIMP' || code === 'EREFUSED') {
        break;
      }
      throw new SSRFDNSResolveError(`cname_failed:${current}:${code ?? 'unknown'}`);
    }
  }

  let aRecords: Array<{ address: string; ttl: number }> = [];
  let aaaaRecords: Array<{ address: string; ttl: number }> = [];
  let aError: Error | undefined;
  let aaaaError: Error | undefined;

  try {
    aRecords = (await resolver.resolve4(current, { ttl: true })) as Array<{ address: string; ttl: number }>;
  } catch (error) {
    aError = error instanceof Error ? error : new Error(String(error));
  }

  try {
    aaaaRecords = (await resolver.resolve6(current, { ttl: true })) as Array<{ address: string; ttl: number }>;
  } catch (error) {
    aaaaError = error instanceof Error ? error : new Error(String(error));
  }

  if ((!aRecords || aRecords.length === 0) && (!aaaaRecords || aaaaRecords.length === 0)) {
    if (aError || aaaaError) {
      const messageParts = [
        aError ? `A:${(aError as Error & { code?: string }).code ?? aError.message}` : null,
        aaaaError ? `AAAA:${(aaaaError as Error & { code?: string }).code ?? aaaaError.message}` : null,
      ].filter(Boolean);
      throw new SSRFDNSResolveError(`resolve_failed:${current}:${messageParts.join(':')}`);
    }
    throw new SSRFDNSEmptyError(`resolve_empty:${current}`);
  }

  const combined = [...(aRecords ?? []), ...(aaaaRecords ?? [])]
    .map((entry) => ({
      ip: normalizeIp(entry.address),
      ttl: Number(entry.ttl),
    }))
    .filter((entry) => entry.ip.length > 0);

  if (combined.length === 0) {
    throw new SSRFDNSEmptyError(`resolve_combined_empty:${current}`);
  }

  for (const entry of combined) {
    if (isPrivateOrBlocked(entry.ip)) {
      throw new SSRFPrivateTargetError(`private_target:${entry.ip}`, entry.ip);
    }
  }

  const ttlCandidates = combined
    .map((entry) => (Number.isFinite(entry.ttl) && entry.ttl >= 0 ? Math.trunc(entry.ttl) : undefined))
    .filter((ttl): ttl is number => ttl !== undefined);

  const minTTLsecRaw = ttlCandidates.length > 0 ? Math.min(...ttlCandidates) : Number.POSITIVE_INFINITY;
  if (!Number.isFinite(minTTLsecRaw)) {
    throw new SSRFDNSResolveError(`resolve_no_ttl:${current}`);
  }

  const minTTLsec = Math.max(1, minTTLsecRaw);

  return {
    ips: combined.map((entry) => entry.ip),
    minTTLsec,
    chain,
    hostnameASCII: current,
  };
}
