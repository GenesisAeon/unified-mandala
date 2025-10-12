import { describe, it, expect } from 'vitest';
import type { KpiConfig } from '../../apps/ui/src/config/useClimateConfig';
import { pollKpis } from '../../apps/ui/src/services/kpi-engine';

describe('kpi-engine', () => {
  it('computes KPI values for known ids and fallback', async () => {
    const kpis: KpiConfig[] = [
      { id: 't2m_anomaly', label: 'T2M', threshold: 2, warn: 1, unit: '°C' },
      { id: 'underground_water', label: 'Water', threshold: 50, warn: 20, unit: 'cm' },
      { id: 'wildfire_risk', label: 'Fire', threshold: 0.7, warn: 0.3, unit: '' },
      { id: 'unknown', label: 'Unknown', threshold: 1, warn: 0.5, unit: '' },
    ];

    const res = await pollKpis(kpis);
    expect(res).toHaveLength(4);

    const byId = Object.fromEntries(res.map((x) => [x.id, x]));

    // Values are deterministic given adapters’ implementations
    expect(byId['t2m_anomaly']).toBeDefined();
    expect(typeof byId['t2m_anomaly'].value).toBe('number');
    expect(['ok', 'warn', 'alarm']).toContain(byId['t2m_anomaly'].status);

    expect(byId['underground_water']).toBeDefined();
    expect(typeof byId['underground_water'].value).toBe('number');
    expect(['ok', 'warn', 'alarm']).toContain(byId['underground_water'].status);

    // wildfire_risk proxies t2m_anomaly scaled to 0..1
    expect(byId['wildfire_risk']).toBeDefined();
    expect(byId['wildfire_risk'].value).toBeGreaterThanOrEqual(0);
    expect(byId['wildfire_risk'].value).toBeLessThanOrEqual(1);

    // unknown falls back to zero
    expect(byId['unknown'].value).toBe(0);
    expect(byId['unknown'].status).toBe('ok');
  });
});
