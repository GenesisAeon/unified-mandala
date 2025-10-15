import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env } as NodeJS.ProcessEnv;

describe('membrane module', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV } as any;
    vi.resetModules();
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('createMembrane returns NoOp in low-memory mode', async () => {
    process.env.LOW_MEM = '1';
    const mod = await import('../index');
    const instance = mod.createMembrane();
    const r = instance.step(Date.now(), 0.5);
    expect(r.state).toBe('subcritical');
    expect(r.severity).toBe('ok');
    expect(r.A).toBe(0);
  });

  it('membraneSigil prefers ASCII in CI mode', async () => {
    process.env.CI = '1';
    const mod = await import('../index');
    expect(mod.membraneSigil('subcritical')).toBe('[ok]');
    expect(mod.membraneSigil('apparent')).toBe('[~]');
    expect(mod.membraneSigil('event')).toBe('[!!]');
  });

  it('RealMembrane emits readings when enabled', async () => {
    delete process.env.LOW_MEM;
    const { createMembrane } = await import('../index');
    const m = createMembrane();
    const reading = m.step(Date.now(), 0.42);
    expect(reading.state).toBeDefined();
    expect(['ok', 'warn', 'alarm']).toContain(reading.severity);
  });
});
