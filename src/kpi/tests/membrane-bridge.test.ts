import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

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

  it('bypasses membrane when LOW_MEM=1 (membrane off)', async () => {
    process.env.LOW_MEM = '1';
    vi.resetModules();
    const mod = await import('../membrane-bridge');
    const r = mod.stepOrBypass('t2m', Date.now(), 0.5);
    expect(r.sigil).toBeDefined();
    expect(r.severity).toBe('ok');
    expect(r.A).toBeUndefined();
  });

  it('processes through membrane when LOW_MEM not set (membrane on)', async () => {
    delete process.env.LOW_MEM;
    process.env.VITE_FEATURE_MEMBRANE = 'on';
    vi.resetModules();
    const { isLowMem } = await import('../../membrane');
    const mod = await import('../membrane-bridge');
    expect(isLowMem).toBe(false);
    mod.stepOrBypass('t2m', Date.now(), 0.5);
    const second = mod.stepOrBypass('t2m', Date.now() + 1000, 3.5);
    expect(typeof second.A).toBe('number');
    expect(['ok', 'warn', 'alarm']).toContain(second.severity);
  });
});
