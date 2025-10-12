import { describe, it, expect, beforeEach, afterEach } from 'vitest';

const OLD_ENV = { ...process.env } as NodeJS.ProcessEnv;

describe('config/runtimeFlags', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV } as any;
    vi.resetModules();
  });
  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('LOW_MEM false by default', async () => {
    delete process.env.LOW_MEM;
    const mod = await import('../../src/config/runtimeFlags');
    expect(mod.LOW_MEM).toBe(false);
  });

  it('LOW_MEM true when env LOW_MEM=1', async () => {
    process.env.LOW_MEM = '1';
    const mod = await import('../../src/config/runtimeFlags');
    expect(mod.LOW_MEM).toBe(true);
  });
});
