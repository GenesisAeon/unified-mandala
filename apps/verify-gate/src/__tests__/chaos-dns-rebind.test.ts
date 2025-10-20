import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const CHAOS_HOST = 'chaos.test';

describe('chaos drill – dns rebind', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.VERIFY_GATE_SSRF_ALLOWLIST = `https://${CHAOS_HOST}`;
    process.env.VERIFY_GATE_ALLOW_PROTOCOLS = 'https';
    process.env.VERIFY_GATE_TTL_FALLBACK_SEC = '30';
  });

  afterEach(() => {
    delete process.env.VERIFY_GATE_SSRF_ALLOWLIST;
    delete process.env.VERIFY_GATE_ALLOW_PROTOCOLS;
    delete process.env.VERIFY_GATE_TTL_FALLBACK_SEC;
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('blocks when the cached host rebinds to a private IP', async () => {
    vi.doMock('node:dns/promises', () => {
      let resolveCount = 0;
      const resolve4 = vi.fn(async () => {
        resolveCount += 1;
        if (resolveCount === 1) {
          return [{ address: '93.184.216.34', ttl: 8 }];
        }
        return [{ address: '127.0.0.1', ttl: 1 }];
      });
      const resolve6 = vi.fn(async () => []);
      const resolveCname = vi.fn(async () => []);
      return {
        default: {
          resolve4,
          resolve6,
          resolveCname,
        },
      };
    });

    const ssrfModule = await import('../security/ssrf.js');
    const dnsCache = await import('../security/dnsCache.js');

    dnsCache.__testing.cache.clear();

    const first = await ssrfModule.assertAllowed(`https://${CHAOS_HOST}/resource`);
    expect(first.ip).toBe('93.184.216.34');

    dnsCache.__testing.cache.clear();

    await expect(ssrfModule.assertAllowed(`https://${CHAOS_HOST}/resource`)).rejects.toBeInstanceOf(
      ssrfModule.SSRFDenyError,
    );
    await expect(ssrfModule.assertAllowed(`https://${CHAOS_HOST}/resource`)).rejects.toMatchObject({
      message: 'upstream_private_blocked',
    });
  });
});
