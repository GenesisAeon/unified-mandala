import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const OLD_ENV = { ...process.env } as NodeJS.ProcessEnv;

describe('membrane module (src/membrane)', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV } as any;
    vi.resetModules();
  });
  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('membraneSigil maps states', async () => {
    const mod = await import('../../src/membrane/index');
    process.env.CI = '1';
    expect(mod.membraneSigil('event')).toBe('[!!]');
    expect(mod.membraneSigil('apparent')).toBe('[~]');
    expect(mod.membraneSigil('subcritical')).toBe('[ok]');
  });

  it('NullMembrane (low mem on) uses NoOp behavior', async () => {
    process.env.LOW_MEM = '1';
    const mod = await import('../../src/membrane/index');
    expect(mod.isLowMem()).toBe(true);
    const Mem = mod.NullMembrane as any;
    const inst = new Mem();
    const r = inst.step(123, 4.2);
    expect(r).toMatchObject({ t: 123, value: 4.2, severity: 'ok', state: 'subcritical', A: 0 });
  });

  it('NullMembrane respects MEMBRANE_MODE=null', async () => {
    process.env.MEMBRANE_MODE = 'null';
    const mod = await import('../../src/membrane/index');
    expect(mod.isLowMem()).toBe(true);
    const Mem = mod.NullMembrane as any;
    const inst = new Mem();
    const r = inst.step(12, 0.9);
    expect(r.A).toBe(0);
  });

  it('NullMembrane (default) uses real implementation', async () => {
    delete process.env.LOW_MEM;
    delete (process.env as any).VITE_LOW_MEM;
    const mod = await import('../../src/membrane/index');
    expect(mod.isLowMem()).toBe(false);
    const Mem = mod.NullMembrane as any;
    const inst = new Mem();
    const r = inst.step(456, 1.1);
    expect(r).toMatchObject({ t: 456, value: 1.1 });
    expect(r.A).toBeGreaterThanOrEqual(0);
    expect(['ok', 'warn', 'alarm']).toContain(r.severity);
  });
});
