import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
const OLD_ENV = { ...process.env } as NodeJS.ProcessEnv;
delete (OLD_ENV as any).LOW_MEM;
delete (OLD_ENV as any).VITE_LOW_MEM;

describe('kpi/membrane-bridge stepOrBypass', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV } as any;
    delete process.env.LOW_MEM;
    delete (process.env as any).VITE_LOW_MEM;
    vi.resetModules();
  });
  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('bypasses when membrane feature is off (LOW_MEM=1)', async () => {
    process.env.LOW_MEM = '1';
    const { membraneSigil } = await import('../../src/membrane');
    const { stepOrBypass } = await import('../../src/kpi/membrane-bridge');
    const r = stepOrBypass('t2m', Date.now(), 1.23);
    expect(r).toEqual({
      A: undefined,
      dA: undefined,
      state: 'subcritical',
      sigil: membraneSigil('subcritical'),
      severity: 'ok',
      enabled: false,
    });
  });

  it('reuses membrane instance per metric when feature is on', async () => {
    delete process.env.LOW_MEM;
    process.env.VITE_FEATURE_MEMBRANE = 'on';
    const { isLowMem } = await import('../../src/membrane');
    const { stepOrBypass } = await import('../../src/kpi/membrane-bridge');
    expect(isLowMem).toBe(false);
    stepOrBypass('groundwater', Date.now(), 0);
    const second = stepOrBypass('groundwater', Date.now() + 1000, 3);
    expect(typeof second.A).toBe('number');
    expect(typeof second.dA).toBe('number');
    expect(['ok', 'warn', 'alarm']).toContain(second.severity);
    expect(second.enabled).toBe(true);
  });

  it('emits boundary events on transitions', async () => {
    delete process.env.LOW_MEM;
    process.env.VITE_FEATURE_MEMBRANE = 'on';
    process.env.MEMBRANE_TWARN = '1.2';
    process.env.MEMBRANE_TOK = '0.8';
    process.env.MEMBRANE_K = '1';
    const sequence = [
      { A: 0, dA: 0, state: 'subcritical', severity: 'ok' as const },
      { A: 3, dA: 3, state: 'event', severity: 'alarm' as const },
      { A: 1, dA: -2, state: 'apparent', severity: 'warn' as const },
      { A: 0, dA: -1, state: 'subcritical', severity: 'ok' as const },
    ];
    let lastReading = sequence[sequence.length - 1];
    vi.doMock('../../src/membrane/registry.js', () => ({
      getMembrane: () => ({
        step: (_t: number, _v: number) => {
          const next = sequence.shift();
          if (next) {
            lastReading = next;
            return next;
          }
          return lastReading;
        },
      }),
    }));
    const boundary = await import('../../src/boundary/publisher');
    const events: any[] = [];
    boundary.setBoundaryPublisher((evt) => {
      events.push(evt);
    });
    const { stepOrBypass } = await import('../../src/kpi/membrane-bridge');
    const base = Date.now();
    stepOrBypass('wildfire', base, 0.1);
    stepOrBypass('wildfire', base + 1, 5);
    stepOrBypass('wildfire', base + 2, 5);
    stepOrBypass('wildfire', base + 3, 5);
    stepOrBypass('wildfire', base + 4, 0.05);
    stepOrBypass('wildfire', base + 5, 0.05);
    stepOrBypass('wildfire', base + 6, 0.05);
    expect(events.length).toBeGreaterThanOrEqual(1);
    boundary.setBoundaryPublisher(null);
  });
});
