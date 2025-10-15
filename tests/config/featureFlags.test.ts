import { describe, it, expect, beforeEach, afterEach } from 'vitest';

const OLD_ENV = { ...process.env } as NodeJS.ProcessEnv;

describe('config/featureFlags', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV } as any;
    // Reset module cache to recompute flags
    vi.resetModules();
  });
  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('defaults: resonance on, emergence off, promptCoach on, membrane off until enabled', async () => {
    delete process.env.LOW_MEM;
    const mod = await import('../../src/config/featureFlags');
    expect(mod.isOn('resonancePanel')).toBe(true);
    expect(mod.isOn('emergenceExplorer')).toBe(false);
    expect(mod.isOn('promptCoach')).toBe(true);
    expect(mod.isOn('membrane')).toBe(false);
  });

  it('membrane off when LOW_MEM=1', async () => {
    process.env.LOW_MEM = '1';
    const mod = await import('../../src/config/featureFlags');
    expect(mod.isOn('membrane')).toBe(false);
  });
});
