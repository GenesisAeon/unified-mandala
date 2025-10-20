import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('dns cache', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetModules();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('coalesces concurrent lookups and respects cache expiration', async () => {
    const resolveSpy = vi.fn(async () => ({
      ips: ['203.0.113.10'],
      minTTLsec: 30,
      chain: ['example.com'],
      hostnameASCII: 'example.com',
    }));

    vi.doMock('../security/resolve.js', () => ({
      __esModule: true,
      resolveHostStrictTTL: resolveSpy,
    }));

    const randomMock = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const mod = await import('../security/dnsCache.js');
    const { resolveWithCache, purgeExpired, __testing } = mod;

    const [a, b] = await Promise.all([
      resolveWithCache('Example.com'),
      resolveWithCache('example.com'),
    ]);

    expect(resolveSpy).toHaveBeenCalledTimes(1);
    expect(a.ips).toEqual(['203.0.113.10']);
    expect(b.ips).toEqual(['203.0.113.10']);

    await resolveWithCache('example.com');
    expect(resolveSpy).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(30001);
    purgeExpired();
    await resolveWithCache('example.com');
    expect(resolveSpy).toHaveBeenCalledTimes(2);

    __testing.cache.clear();
    __testing.inflight.clear();
    randomMock.mockRestore();
  });

  it('jitter stays within the expected bounds', async () => {
    const mod = await import('../security/dnsCache.js');
    const { __testing } = mod;

    const maxMock = vi.spyOn(Math, 'random').mockReturnValue(1);
    expect(__testing.jitter(10_000)).toBeLessThanOrEqual(11_000);

    maxMock.mockReturnValue(0);
    const low = __testing.jitter(10_000);
    expect(low).toBeGreaterThanOrEqual(9_000);

    maxMock.mockReturnValue(0);
    expect(__testing.jitter(500)).toBeGreaterThanOrEqual(1_000);
    maxMock.mockRestore();
  });
});
