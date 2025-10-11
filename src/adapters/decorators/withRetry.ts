import { Adapter, AdapterInput, AdapterResult } from '../base';

export interface RetryOpts {
  retries?: number; // default 3
  backoffMs?: number; // initial, default 200
  maxBackoffMs?: number; // cap, default 2000
  jitter?: boolean; // default true
  retryOn?: (res: AdapterResult<any> | Error) => boolean; // default: network/error or !ok
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function withRetry<T>(opts: RetryOpts = {}) {
  const {
    retries = 3,
    backoffMs = 200,
    maxBackoffMs = 2000,
    jitter = true,
    retryOn = (x) =>
      x instanceof Error ||
      (typeof x === 'object' && x !== null && 'ok' in x && (x as any).ok === false),
  } = opts;

  return (next: Adapter<T>): Adapter<T> => {
    return async (input?: AdapterInput): Promise<AdapterResult<T>> => {
      let attempt = 0;
      let delay = backoffMs;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        try {
          const res = await next(input);
          if (!retryOn(res) || attempt >= retries) return res;
        } catch (e: any) {
          if (!retryOn(e) || attempt >= retries) {
            return { ok: false, error: e?.message || String(e) };
          }
        }
        attempt++;
        const j = jitter ? Math.random() * 0.4 + 0.8 : 1; // 0.8–1.2x
        await wait(Math.min(delay * j, maxBackoffMs));
        delay = Math.min(delay * 2, maxBackoffMs);
      }
    };
  };
}
