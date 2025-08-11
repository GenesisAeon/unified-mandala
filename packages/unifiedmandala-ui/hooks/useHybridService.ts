import { useEffect, useState } from 'react';

export interface HybridResponse<T = any> {
  result: T;
  crep: number;
}

/**
 * Query multiple service endpoints in parallel and return the response
 * with the highest CREP score.
 */
export function useHybridService<T = any>(services: string[]) {
  const [response, setResponse] = useState<HybridResponse<T> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchServices() {
      const results = await Promise.all(
        services.map((url) =>
          fetch(url)
            .then((r) => r.json())
            .catch(() => null)
        )
      );

      const valid = results.filter(
        (r): r is HybridResponse<T> => !!r && typeof r.crep === 'number'
      );

      if (!cancelled) {
        if (valid.length === 0) {
          setResponse(null);
        } else {
          const best = valid.reduce((a, b) => (b.crep > a.crep ? b : a));
          setResponse(best);
        }
      }
    }

    fetchServices();
    return () => {
      cancelled = true;
    };
  }, [services]);

  return response;
}
