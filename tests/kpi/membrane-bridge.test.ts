import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env } as NodeJS.ProcessEnv;

describe('kpi/membrane-bridge stepOrBypass', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, UM_ASCII_SIGILS: '1', VITE_FEATURE_MEMBRANE: 'off' } as any;
    process.env.LOW_MEM = '0';
    delete (process.env as any).VITE_LOW_MEM;
    vi.resetModules();
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('bypasses when membrane feature is off or LOW_MEM=1', async () => {
    process.env.LOW_MEM = '1';
    const { stepOrBypass } = await import('../../src/kpi/membrane-bridge');
    const r = stepOrBypass('t2m', Date.now(), 1.23);
    expect(r).toEqual({ A: undefined, sigil: '[ok]', severity: 'ok' });
  });

  it('switches to membrane processing when feature enabled', async () => {
    delete process.env.LOW_MEM;
    process.env.MEMBRANE_ON = '1';
    process.env.VITE_FEATURE_MEMBRANE = 'on';
    const { FEATURES } = await import('../../src/config/featureFlags');
    expect(FEATURES.membrane).toBe('on');
    const { resetMembraneRegistry, stepOrBypass } = await import('../../src/kpi/membrane-bridge');
    resetMembraneRegistry();
    const now = Date.now();
    stepOrBypass('groundwater', now, 0);
    stepOrBypass('groundwater', now + 1_000, 0.5);
    const result = stepOrBypass('groundwater', now + 2_000, 3.2);
    expect(result.A).toBeGreaterThanOrEqual(0);
    expect(['ok', 'warn', 'alarm']).toContain(result.severity);
    expect(['[ok]', '[~]', '[!!]']).toContain(result.sigil);
  });
});
