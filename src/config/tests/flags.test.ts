import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('runtime and feature flags', () => {
  const prev = process.env.LOW_MEM;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    if (prev === undefined) delete process.env.LOW_MEM;
    else process.env.LOW_MEM = prev;
    vi.unstubAllEnvs();
  });

  it('LOW_MEM true when env LOW_MEM=1', async () => {
    process.env.LOW_MEM = '1';
    const runtime = await import('../runtimeFlags');
    expect(runtime.LOW_MEM).toBe(true);
  });

  it('LOW_MEM false when env not set', async () => {
    vi.stubEnv('LOW_MEM', '0');
    vi.stubEnv('VITE_LOW_MEM', 'off');
    const runtime = await import('../runtimeFlags');
    expect(runtime.LOW_MEM).toBe(false);
  });

  it('membrane flag is off when LOW_MEM=true and remains off until explicitly enabled', async () => {
    process.env.LOW_MEM = '1';
    const feat1 = await import('../featureFlags');
    expect(feat1.isOn('membrane')).toBe(false);

    // Now without LOW_MEM, default keeps it disabled
    delete process.env.LOW_MEM;
    vi.resetModules();
    const feat2 = await import('../featureFlags');
    expect(feat2.isOn('membrane')).toBe(false);
  });
});
