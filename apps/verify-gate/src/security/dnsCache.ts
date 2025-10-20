import { setInterval as nodeSetInterval } from 'node:timers';
import { resolveHostStrictTTL, type ResolveResult } from './resolve.js';

export type CachedResolve = ResolveResult & { exp: number };

const inflight = new Map<string, Promise<CachedResolve>>();
const cache = new Map<string, CachedResolve>();

const jitter = (ttlMs: number): number => {
  const base = Math.max(1000, ttlMs);
  const window = Math.min(5000, base * 0.1);
  const delta = (Math.random() * 2 - 1) * window;
  const candidate = base + delta;
  return Math.max(1000, Math.trunc(candidate));
};

const cloneResult = (entry: CachedResolve): ResolveResult => ({
  ips: [...entry.ips],
  minTTLsec: entry.minTTLsec,
  chain: [...entry.chain],
  hostnameASCII: entry.hostnameASCII,
});

const normalizeKey = (hostname: string): string => hostname.trim().toLowerCase();

export async function resolveWithCache(hostname: string): Promise<ResolveResult> {
  const key = normalizeKey(hostname);
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.exp > now) {
    return cloneResult(hit);
  }

  const pending = inflight.get(key);
  if (pending) {
    const result = await pending;
    return cloneResult(result);
  }

  const resolver = (async () => {
    const resolved = await resolveHostStrictTTL(hostname);
    const ttlMs = jitter(resolved.minTTLsec * 1000);
    const entry: CachedResolve = {
      ips: [...resolved.ips],
      minTTLsec: resolved.minTTLsec,
      chain: [...resolved.chain],
      hostnameASCII: resolved.hostnameASCII,
      exp: Date.now() + ttlMs,
    };
    cache.set(key, entry);
    return entry;
  })()
    .catch((error) => {
      cache.delete(key);
      throw error;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, resolver);
  const entry = await resolver;
  return cloneResult(entry);
}

export function purgeExpired(): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (entry.exp <= now) {
      cache.delete(key);
    }
  }
}

export function scheduleCacheMaintenance(intervalMs = 60000): () => void {
  const timer = nodeSetInterval(() => {
    try {
      purgeExpired();
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('[verify-gate] dns cache purge failed', error);
      }
    }
  }, intervalMs);
  if (typeof timer.unref === 'function') {
    timer.unref();
  }
  return () => clearInterval(timer);
}

export const __testing = {
  cache,
  inflight,
  jitter,
  normalizeKey,
};
