import { describe, it, expect, beforeEach } from 'vitest';

describe('metrics/reality', () => {
  beforeEach(() => {
    delete (globalThis as any).__UM_METRICS__;
  });

  it('records gauge and counter entries', async () => {
    const s = await import('../../src/metrics/singleton');
    const { recordReality, realityScoreGauge, realityDecisionTotal } = await import(
      '../../src/metrics/reality'
    );

    recordReality('test', 0.42, 'external');
    // Access underlying prom-client via metrics text
    const text = await s.metricsText();
    expect(text).toContain('reality_score');
    expect(text).toContain('reality_decision_total');

    // sanity: metric label methods exist
    expect(typeof (realityScoreGauge as any).labels).toBe('function');
    expect(typeof (realityDecisionTotal as any).labels).toBe('function');
  });
});
