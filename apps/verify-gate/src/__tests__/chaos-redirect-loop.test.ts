import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const baselineAllow = {
  ip: '203.0.113.55',
  ips: ['203.0.113.55'],
  minTTLsec: 30,
  chain: ['chaos.loop'],
  hostname: 'chaos.loop',
  url: new URL('https://chaos.loop/resource'),
};

describe('chaos drill – redirect loop guard', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('throws when redirects exceed the configured hop limit', async () => {
    const pinnedRequestMock = vi.fn(async () => ({
      res: {
        statusCode: 302,
        headers: { location: 'https://chaos.loop/resource' },
        body: null,
      },
      dispose: vi.fn(),
    }));

    const actualSsrf = await vi.importActual<typeof import('../security/ssrf.js')>('../security/ssrf.js');
    const allowMock = vi.fn(async () => ({
      ...baselineAllow,
      url: new URL('https://chaos.loop/resource'),
    }));

    vi.doMock('../proxy/pinnedRequest.js', () => ({
      pinnedRequest: pinnedRequestMock,
    }));
    vi.doMock('../security/ssrf.js', () => ({
      ...actualSsrf,
      assertAllowed: allowMock,
    }));

    const { followRedirects, RedirectTooManyError } = await import('../proxy/followRedirects.js');

    await expect(
      followRedirects(new URL('https://chaos.loop/resource'), { allow: baselineAllow }, 1),
    ).rejects.toBeInstanceOf(RedirectTooManyError);

    expect(pinnedRequestMock).toHaveBeenCalledTimes(1);
    expect(allowMock).toHaveBeenCalledTimes(1);
  });

  it('blocks redirect chains that resolve to private targets', async () => {
    const pinnedRequestMock = vi.fn(async () => ({
      res: {
        statusCode: 302,
        headers: { location: 'http://169.254.169.254/private' },
        body: null,
      },
      dispose: vi.fn(),
    }));

    const actualSsrf = await vi.importActual<typeof import('../security/ssrf.js')>('../security/ssrf.js');
    const allowMock = vi.fn(async (target: string) => {
      if (target.includes('169.254.169.254')) {
        throw new actualSsrf.SSRFDenyError('upstream_private_blocked');
      }
      return baselineAllow;
    });

    vi.doMock('../proxy/pinnedRequest.js', () => ({
      pinnedRequest: pinnedRequestMock,
    }));
    vi.doMock('../security/ssrf.js', () => ({
      ...actualSsrf,
      assertAllowed: allowMock,
    }));

    const { followRedirects, RedirectPrivateTargetError } = await import('../proxy/followRedirects.js');

    await expect(
      followRedirects(new URL('https://chaos.loop/resource'), { allow: baselineAllow }, 3),
    ).rejects.toBeInstanceOf(RedirectPrivateTargetError);

    expect(pinnedRequestMock).toHaveBeenCalledTimes(1);
    expect(allowMock).toHaveBeenCalledTimes(1);
  });
});
