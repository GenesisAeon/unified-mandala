import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env } as NodeJS.ProcessEnv;

describe('kpi/membrane-bridge stepOrBypass', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, UM_ASCII_SIGILS: '1' } as any;
    process.env.LOW_MEM = '0';
    delete (process.env as any).VITE_LOW_MEM;
    vi.resetModules();
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('bypasses membrane when LOW_MEM=1 (membrane off)', async () => {
    process.env.LOW_MEM = '1';
    const mod = await import('../membrane-bridge');
    const r = mod.stepOrBypass('t2m', Date.now(), 0.5);
    expect(r).toEqual({ A: undefined, sigil: '[ok]', severity: 'ok' });
  });

  it('processes readings when membrane feature is enabled', async () => {
    delete process.env.LOW_MEM;
    process.env.MEMBRANE_ON = '1';
    process.env.VITE_FEATURE_MEMBRANE = 'on';
    const { FEATURES } = await import('../../config/featureFlags');
    expect(FEATURES.membrane).toBe('on');
    const mod = await import('../membrane-bridge');
    mod.resetMembraneRegistry();
    const r = mod.stepOrBypass('t2m', Date.now(), 2.5);
    expect(r.A).toBeDefined();
    expect(['ok', 'warn', 'alarm']).toContain(r.severity);
    expect(['[ok]', '[~]', '[!!]']).toContain(r.sigil);
  });
});
