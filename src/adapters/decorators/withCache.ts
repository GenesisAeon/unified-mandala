import { Adapter, AdapterInput, AdapterResult, keyOf } from '../base';

export interface CacheOpts<T> {
  ttlMs: number; // Lebensdauer
  key?: (input?: AdapterInput) => string;
  // Optional: Stale-While-Revalidate (SWR) → out of scope v1 (einfacher Cache)
}

type Entry<T> = { until: number; value: AdapterResult<T> };
export function withCache<T>(opts: CacheOpts<T>) {
  const { ttlMs, key = keyOf } = opts;
  const map = new Map<string, Entry<T>>();

  return (next: Adapter<T>): Adapter<T> => {
    return async (input?: AdapterInput): Promise<AdapterResult<T>> => {
      const k = key(input);
      const now = Date.now();
      const hit = map.get(k);
      if (hit && hit.until > now && hit.value.ok) {
        return { ...hit.value, cached: true };
      }
      const res = await next(input);
      if (res.ok) {
        map.set(k, { until: now + ttlMs, value: res });
      }
      return res;
    };
  };
}
