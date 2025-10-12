import { describe, it, expect, vi, beforeEach } from 'vitest';

// Provide a minimal react shim for useMemo (no dependency on real React)
vi.mock('react', () => ({
  useMemo: (fn: any) => fn(),
}));

// First scenario: valid YAML with one KPI
vi.mock('~config/climate-dashboard.yaml?raw', () => ({
  default: 'kpis:\n  - id: a\n    label: A\n    threshold: 10\n    warn: 5\n    unit: x\n',
}));

describe('useClimateConfig', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('parses YAML and returns kpis', async () => {
    const mod = await import('../../apps/ui/src/config/useClimateConfig');
    const res = mod.useClimateConfig();
    expect(res.kpis.length).toBe(1);
    expect(res.kpis[0]).toMatchObject({ id: 'a', label: 'A', unit: 'x' });
  });

  it('returns empty on parse failure', async () => {
    // Remock raw import with invalid YAML
    vi.doMock('~config/climate-dashboard.yaml?raw', () => ({ default: '::invalid::' }));
    const mod = await import('../../apps/ui/src/config/useClimateConfig');
    const res = mod.useClimateConfig();
    expect(res.kpis).toEqual([]);
  });
});
