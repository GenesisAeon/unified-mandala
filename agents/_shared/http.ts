import { withRetry } from './retry';
export function makeHttp(guard: {
  ensureAllowedDomain: (url: string) => void;
  requestTimeoutMs: number;
}) {
  return async (url: string, init: RequestInit & { timeoutMs?: number } = {}) => {
    guard.ensureAllowedDomain(url);
    const timeoutMs = init.timeoutMs ?? guard.requestTimeoutMs ?? 120000;
    return withRetry(
      async () => {
        const ac = new AbortController();
        const t = setTimeout(() => ac.abort(), timeoutMs);
        try {
          const res = await fetch(url, { ...init, signal: ac.signal });
          if (!res.ok) throw new Error(`http_${res.status}`);
          return res;
        } finally {
          clearTimeout(t);
        }
      },
      3,
      400,
      true,
    );
  };
}
