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
    expect(mod.membraneSigil('subcritical')).toBeDefined();
    expect(mod.membraneSigil('apparent')).toBeDefined();
    expect(mod.membraneSigil('event')).toBeDefined();
  });

  it('real-membrane NullMembrane returns subcritical ok reading', async () => {
    const real = await import('../real-membrane');
    const inst = new real.NullMembrane();
    const r = inst.step(Date.now(), 0.42);
    expect(r.state).toBe('subcritical');
    expect(r.severity).toBe('ok');
    expect(r.A).toBe(0);
  });
});
