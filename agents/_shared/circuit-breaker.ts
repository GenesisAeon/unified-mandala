export function makeCircuitBreaker(opts: { failure_threshold: number; cooldown_ms: number }) {
  let failures = 0;
  let openUntil = 0;
  return {
    async exec<T>(fn: () => Promise<T>): Promise<T> {
      const now = Date.now();
      if (now < openUntil) throw new Error('circuit_open');
      try {
        const res = await fn();
        failures = 0;
        return res;
      } catch (e) {
        failures++;
        if (failures >= opts.failure_threshold) {
          openUntil = now + opts.cooldown_ms;
        }
        throw e;
      }
    },
  };
}
