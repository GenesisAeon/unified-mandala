import { describe, it, expect, vi } from 'vitest';

describe('featureFlags', () => {
  it('isOn returns true for default-on flags without LOW_MEM', async () => {
    vi.resetModules();
    delete (process as any).env.LOW_MEM;
    const mod = await import('../featureFlags');
    expect(mod.isOn('resonancePanel')).toBe(true);
    expect(mod.isOn('promptCoach')).toBe(true);
  });
});
