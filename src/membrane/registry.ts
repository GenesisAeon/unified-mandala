import { MEMBRANE_CACHE_TTL_MS } from './config.js';
import { RealMembrane } from './real-membrane.js';

const cache = new Map<string, { membrane: RealMembrane; lastAccess: number }>();

const ttl = Math.max(1, MEMBRANE_CACHE_TTL_MS);

const now = () => Date.now();

export function getMembrane(key: string, factory: () => RealMembrane): RealMembrane {
  const timestamp = now();
  const entry = cache.get(key);
  if (entry && timestamp - entry.lastAccess < ttl) {
    entry.lastAccess = timestamp;
    return entry.membrane;
  }
  const membrane = factory();
  cache.set(key, { membrane, lastAccess: timestamp });
  return membrane;
}

export function resetMembrane(key?: string) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}
