import { afterEach, describe, expect, it, vi } from 'vitest';

const pinnedRequestMock = vi.fn();
const assertAllowedMock = vi.fn();

vi.mock('../proxy/pinnedRequest.js', () => ({
  __esModule: true,
  pinnedRequest: pinnedRequestMock,
}));

class MockSSRFDenyError extends Error {}

vi.mock('../security/ssrf.js', () => ({
  __esModule: true,
  assertAllowed: assertAllowedMock,
  SSRFDenyError: MockSSRFDenyError,
}));

describe('followRedirects', () => {
  afterEach(() => {
    pinnedRequestMock.mockReset();
    assertAllowedMock.mockReset();
    vi.resetModules();
  });

  it('halts when redirect target fails SSRF validation', async () => {
    const startAllow = {
      ip: '198.51.100.10',
      ips: ['198.51.100.10'],
      minTTLsec: 30,
      chain: ['start.example'],
      hostname: 'start.example',
      url: new URL('http://start.example'),
    } satisfies import('../security/ssrf.js').AllowResult;

    const dispose = vi.fn();
    pinnedRequestMock.mockResolvedValueOnce({
      res: {
        statusCode: 302,
        headers: { location: 'http://169.254.169.254' },
      },
      dispose,
    });

    assertAllowedMock.mockRejectedValueOnce(new MockSSRFDenyError('upstream_private_blocked'));

    const { followRedirects, RedirectPrivateTargetError } = await import('../proxy/followRedirects.js');

    await expect(
      followRedirects(new URL('http://start.example'), { allow: startAllow }, 2),
    ).rejects.toBeInstanceOf(RedirectPrivateTargetError);

    expect(pinnedRequestMock).toHaveBeenCalledTimes(1);
    expect(assertAllowedMock).toHaveBeenCalledTimes(1);
    expect(dispose).toHaveBeenCalledTimes(1);
  });
});
