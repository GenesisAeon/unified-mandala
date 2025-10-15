import { describe, it, expect, vi } from 'vitest';

describe('membrane module', () => {
  it('NullMembrane is NoOp when LOW_MEM=1', async () => {
    process.env.LOW_MEM = '1';
    vi.resetModules();
    const mod = await import('../index');
    const Mem = mod.NullMembrane as any;
    const inst = new Mem();
    const r = inst.step(0, 0.5);
    expect(r.state).toBe('subcritical');
    expect(r.severity).toBe('ok');
    expect(r.A).toBe(0);
  });

  it('membraneSigil maps states', async () => {
    delete process.env.LOW_MEM;
    vi.resetModules();
    const mod = await import('../index');
    expect(mod.membraneSigil('subcritical', true)).toBe('--');
    expect(mod.membraneSigil('apparent', true)).toBe('~~');
    expect(mod.membraneSigil('event', true)).toBe('[!]');
  });

  it('real membrane returns severity with computed amplitude', async () => {
    const real = await import('../real-membrane');
    const inst = new real.RealMembrane();
    const t = Date.now();
    const r = inst.step(t, 0.42);
    expect(r.state).toBeTypeOf('string');
    expect(r.A).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(r.dA)).toBe(true);
    expect(['ok', 'warn', 'alarm']).toContain(r.severity);
  });
});
