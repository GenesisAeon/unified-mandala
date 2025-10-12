import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const OLD_ENV = { ...process.env } as NodeJS.ProcessEnv;

describe('prompt/coach', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV } as any;
    vi.resetModules();
  });
  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('heuristicOptimize adds role, resolves conflict, and appends JSON output', async () => {
    const { heuristicOptimize } = await import('../../src/prompt/coach');
    const raw = 'Bitte sei kurz und ausführlich.';
    const r = heuristicOptimize(raw);
    expect(r.optimized).toMatch(/system:/i);
    expect(r.optimized).toMatch(/Output: JSON/i);
    expect(r.reasons.length).toBeGreaterThan(0);
    expect(r.findings.some((f) => f.type === 'missing_role')).toBe(true);
    expect(r.findings.some((f) => f.type === 'conflict')).toBe(true);
  });

  it('maybeRemoteOptimize returns null when ALLOW_NET is not 1', async () => {
    const { maybeRemoteOptimize } = await import('../../src/prompt/coach');
    const r = await maybeRemoteOptimize('x');
    expect(r).toBeNull();
  });

  it('maybeRemoteOptimize calls fetch when allowed and returns advice', async () => {
    process.env.ALLOW_NET = '1';
    const mock = vi.spyOn(globalThis, 'fetch' as any).mockImplementation(
      async () =>
        ({
          ok: true,
          json: async () => ({ optimized: 'OPT', reasons: ['r'], findings: [] }),
        }) as any,
    );
    const { maybeRemoteOptimize } = await import('../../src/prompt/coach');
    const r = await maybeRemoteOptimize('X', 'http://example', 'key');
    expect(r).toEqual({ optimized: 'OPT', reasons: ['r'], findings: [] });
    mock.mockRestore();
  });

  it('maybeRemoteOptimize throws on non-ok response', async () => {
    process.env.ALLOW_NET = '1';
    const mock = vi.spyOn(globalThis, 'fetch' as any).mockImplementation(
      async () =>
        ({
          ok: false,
          status: 500,
          json: async () => ({}),
        }) as any,
    );
    const { maybeRemoteOptimize } = await import('../../src/prompt/coach');
    await expect(maybeRemoteOptimize('X', 'http://e', 'k')).rejects.toThrow(/optimizer HTTP/);
    mock.mockRestore();
  });
});
