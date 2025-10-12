import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock ERA5 and Pegel adapters used by kpi-engine with deterministic last values
vi.mock('../../src/adapters/era5', () => {
  return {
    ERA5Adapter: {
      id: 'era5',
      fetchSeries: vi.fn(async () => ({
        id: 'era5',
        unit: 'K',
        points: [
          // Kelvin: baseline 15°C + delta
          { t: 't-1', v: 273.15 + 15 + 1 }, // anomaly 1°C (warn)
        ],
      })),
    },
  };
});

vi.mock('../../src/adapters/pegel', () => {
  return {
    PegelAdapter: {
      id: 'pegel',
      fetchSeries: vi.fn(async () => ({
        id: 'pegel',
        unit: 'cm',
        points: [
          { t: 't-1', v: 320 }, // delta +20 (warn)
        ],
      })),
    },
  };
});

import type { KpiConfig } from '../../apps/ui/src/config/useClimateConfig';
import { pollKpis } from '../../apps/ui/src/services/kpi-engine';

describe('kpi-engine thresholds', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('flags warn at boundary values and alarm above threshold', async () => {
    const warnCfg: KpiConfig = { id: 't2m_anomaly', label: '', warn: 1, threshold: 2, unit: '°C' };
    const uwCfg: KpiConfig = {
      id: 'underground_water',
      label: '',
      warn: 20,
      threshold: 50,
      unit: 'cm',
    };

    const [t2m, uw] = await pollKpis([warnCfg, uwCfg]);
    expect(t2m.status).toBe('warn'); // anomaly = 1
    expect(uw.status).toBe('warn'); // delta = 20
  });
});
