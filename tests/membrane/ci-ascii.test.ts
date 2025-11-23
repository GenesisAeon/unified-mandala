import { describe, it, expect, vi } from 'vitest';

describe('membrane sigil ASCII guard', () => {
  it('uses ASCII sigils under CI', async () => {
    const OLD = process.env.CI;
    process.env.CI = '1';
    vi.resetModules();
    const { membraneSigil } = await import('../../src/membrane');
    const sigil = membraneSigil('event');
    expect(/^[ -~]+$/.test(sigil)).toBe(true);
    process.env.CI = OLD;
  });

  it('allows emoji when not forced', async () => {
    delete process.env.CI;
    vi.resetModules();
    const { membraneSigil } = await import('../../src/membrane');
    expect(membraneSigil('apparent', false)).toBe('🟠');
  });
});
