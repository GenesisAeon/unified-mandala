import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('config/runtimeFlags', () => {
  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('LOW_MEM false by default', async () => {
    vi.stubEnv('LOW_MEM', '0');
    vi.stubEnv('VITE_LOW_MEM', 'off');
    const mod = await import('../../src/config/runtimeFlags');
    expect(mod.LOW_MEM).toBe(false);
  });

  it('LOW_MEM true when env LOW_MEM=1', async () => {
    vi.stubEnv('LOW_MEM', '1');
    const mod = await import('../../src/config/runtimeFlags');
    expect(mod.LOW_MEM).toBe(true);
  });
});
