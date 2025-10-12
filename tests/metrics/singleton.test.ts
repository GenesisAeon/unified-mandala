import { describe, it, expect, beforeEach } from 'vitest';

describe('metrics/singleton', () => {
  beforeEach(() => {
    // reset global store between tests
    delete (globalThis as any).__UM_METRICS__;
  });

  it('creates and reuses counter/gauge/histogram/summary', async () => {
    const s = await import('../../src/metrics/singleton');
    const c1 = s.getOrCreateCounter({ name: 'x_counter', labelNames: ['a'] });
    const c2 = s.getOrCreateCounter({ name: 'x_counter' });
    expect(c1).toBe(c2);

    const g1 = s.getOrCreateGauge({ name: 'x_gauge' });
    const g2 = s.getOrCreateGauge({ name: 'x_gauge' });
    expect(g1).toBe(g2);

    const h1 = s.getOrCreateHistogram({ name: 'x_hist' });
    const h2 = s.getOrCreateHistogram({ name: 'x_hist' });
    expect(h1).toBe(h2);

    const sm1 = s.getOrCreateSummary({ name: 'x_sum' });
    const sm2 = s.getOrCreateSummary({ name: 'x_sum' });
    expect(sm1).toBe(sm2);

    s.ensureDefaultMetrics();
    const text = await s.metricsText();
    expect(typeof text).toBe('string');
  });
});
