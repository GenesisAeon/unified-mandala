import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('metrics singleton + reality', () => {
  beforeEach(() => {
    // reset global metrics store between tests
    (globalThis as any).__UM_METRICS__ = undefined;
    vi.resetModules();
  });

  it('getOrCreate creates counters and avoids duplicates', async () => {
    const m1 = await import('../singleton');
    const c1 = m1.getOrCreateCounter({ name: 'x_total', labelNames: ['a'] });
    const c2 = m1.getOrCreateCounter({ name: 'x_total', labelNames: ['a'] });
    expect(c1).toBe(c2);
    const g1 = m1.getOrCreateGauge({ name: 'x_value' });
    g1.set(1);
    const text = await m1.metricsText();
    expect(typeof text).toBe('string');
    expect(text).toContain('x_value');
  });

  it('recordReality updates gauge and counter with labels', async () => {
    const m1 = await import('../singleton');
    const r = await import('../reality');
    r.recordReality('sensorA', 0.8, 'external');
    const text = await m1.metricsText();
    expect(text).toContain('reality_score');
    expect(text).toContain('reality_decision_total');
  });
});
