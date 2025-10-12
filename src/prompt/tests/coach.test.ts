import { describe, it, expect, vi } from 'vitest';
import { heuristicOptimize, maybeRemoteOptimize } from '../coach';

describe('prompt/coach', () => {
  it('heuristicOptimize adds missing role and output format', () => {
    const raw = 'Bitte beantworte die Frage.';
    const out = heuristicOptimize(raw);
    expect(out.optimized).toMatch(/system:/i);
    expect(out.optimized).toMatch(/Output: JSON/i);
    expect(out.reasons.length).toBeGreaterThanOrEqual(1);
    expect(out.findings.some((f) => f.type === 'missing_role')).toBe(true);
  });

  it('maybeRemoteOptimize returns null when ALLOW_NET not set', async () => {
    delete process.env.ALLOW_NET;
    const res = await maybeRemoteOptimize('hi');
    expect(res).toBeNull();
  });

  it('maybeRemoteOptimize throws on non-ok response when allowed', async () => {
    process.env.ALLOW_NET = '1';
    const fetchMock = vi.fn(async () => ({ ok: false, status: 500 }));
    (globalThis as any).fetch = fetchMock as any;
    await expect(maybeRemoteOptimize('x', 'http://unit', 'k')).rejects.toThrow(/HTTP 500/);
  });
});
