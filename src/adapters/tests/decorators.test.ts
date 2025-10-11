import { describe, it, expect, vi } from 'vitest';
import { Adapter, AdapterResult, ok, fail } from '../base';
import { withRetry } from '../decorators/withRetry';
import { withRateLimit } from '../decorators/withRateLimit';
import { withCache } from '../decorators/withCache';
import { withSchema } from '../decorators/withSchema';
import { z } from 'zod';

function mkFlaky(timesFail: number, succeedValue: number): Adapter<number> {
  let left = timesFail;
  return async () => {
    if (left-- > 0) return fail('temporary');
    return ok(succeedValue);
  };
}

describe('decorators', () => {
  it('withRetry recovers flaky adapter', async () => {
    const flaky = mkFlaky(2, 42);
    const retried = withRetry({ retries: 3, backoffMs: 1, jitter: false })(flaky);
    const res = await retried();
    expect(res.ok).toBe(true);
    expect(res.data).toBe(42);
  });

  it('withCache returns cached on second call', async () => {
    let calls = 0;
    const base: Adapter<number> = async () => {
      calls++;
      return ok(7);
    };
    const cached = withCache<number>({ ttlMs: 1000 })(base);
    const r1 = await cached({ params: { a: 1 } });
    const r2 = await cached({ params: { a: 1 } });
    expect(r1.ok && r2.ok).toBe(true);
    expect(r2.cached).toBe(true);
    expect(calls).toBe(1);
  });

  it('withRateLimit enforces window capacity', async () => {
    vi.useFakeTimers();
    const base: Adapter<number> = async () => ok(Date.now()); // unterschiedliche Timestamps
    const rate = withRateLimit<number>({ capacity: 1, intervalMs: 1000 })(base);
    const p1 = rate();
    const p2 = rate(); // sollte erst nach ~1s laufen
    vi.advanceTimersByTime(1); // tick minimal für p1
    const t1 = (await p1).data!;
    vi.advanceTimersByTime(1000); // Fenster öffnen
    const t2 = (await p2).data!;
    expect(t2 - t1).toBeGreaterThanOrEqual(1000);
    vi.useRealTimers();
  });

  it('withSchema validates output', async () => {
    const base: Adapter<any> = async () => ok({ x: 1 });
    const schema = z.object({ x: z.number() });
    const wrapped = withSchema(schema)(base);
    expect((await wrapped()).ok).toBe(true);

    const bad: Adapter<any> = async () => ok({ x: 'oops' });
    const badWrapped = withSchema(schema)(bad);
    const res = await badWrapped();
    expect(res.ok).toBe(false);
    expect(res.error).toContain('Schema');
  });
});
