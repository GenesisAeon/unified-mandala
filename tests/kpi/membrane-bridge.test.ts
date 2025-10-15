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
    expect(r).toEqual({ A: undefined, sigil: membraneSigil('subcritical'), severity: 'ok' });
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
    expect(['ok', 'warn', 'alarm']).toContain(second.severity);
  });
});
