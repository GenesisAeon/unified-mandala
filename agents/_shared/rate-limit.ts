// sehr einfacher Token-Bucket pro Key (In-Memory)
const buckets = new Map<string,{ tokens:number; last:number }>();
export function makeRateLimiter(qps: number) {
  return async (key = "global") => {
    const now = Date.now();
    const b = buckets.get(key) || { tokens: qps, last: now };
    const refill = ((now - b.last) / 1000) * qps;
    b.tokens = Math.min(qps, b.tokens + refill);
    b.last = now;
    if (b.tokens < 1) {
      const waitMs = ((1 - b.tokens) / qps) * 1000;
      await new Promise(r => setTimeout(r, waitMs));
      b.tokens = 0;
    } else {
      b.tokens -= 1;
    }
    buckets.set(key, b);
  };
}

