import { describe, it, expect, vi } from 'vitest';

describe('kpi/membrane-bridge stepOrBypass', () => {
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
    vi.resetModules();
    const mod = await import('../membrane-bridge');
    const r = mod.stepOrBypass('t2m', Date.now(), 0.5);
    expect(typeof r.sigil).toBe('string');
    expect(['ok', 'warn', 'alarm']).toContain(r.severity);
  });
});
