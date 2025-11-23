import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

const mocks = vi.hoisted(() => ({
  pinnedRequestMock: vi.fn(),
  assertAllowed: vi.fn(),
}));

vi.mock('../proxy/pinnedRequest.js', () => ({
  pinnedRequest: mocks.pinnedRequestMock,
}));

vi.mock('../security/ssrf.js', () => ({
  assertAllowed: mocks.assertAllowed,
  SSRFDenyError: class extends Error {},
}));

describe('redirect preflight fallback', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
    mocks.pinnedRequestMock.mockReset();
    mocks.assertAllowed.mockReset();
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
  });

  it('falls back to GET range probe when HEAD returns 405', async () => {
    mocks.pinnedRequestMock
      .mockResolvedValueOnce({
        res: { statusCode: 405, headers: {}, body: null },
        dispose: vi.fn(),
      })
      .mockResolvedValueOnce({
        res: { statusCode: 301, headers: { location: 'https://good.example/' }, body: null },
        dispose: vi.fn(),
      })
      .mockResolvedValueOnce({
        res: { statusCode: 200, headers: {}, body: null },
        dispose: vi.fn(),
      });

    mocks.assertAllowed.mockImplementation(async (value: string) => ({
      ip: value.includes('good.example') ? '198.51.100.2' : '198.51.100.1',
      ips: [value.includes('good.example') ? '198.51.100.2' : '198.51.100.1'],
      minTTLsec: 42,
      chain: [],
      hostname: value.includes('good.example') ? 'good.example' : 'start.example',
      url: new URL(value),
    }));

    const { followRedirectsWithPreflight } = await import('../proxy/followRedirects.js');

    const allow = {
      ip: '198.51.100.1',
      ips: ['198.51.100.1'],
      minTTLsec: 42,
      chain: [],
      hostname: 'start.example',
      url: new URL('https://start.example/'),
    };

    const result = await followRedirectsWithPreflight(new URL('https://start.example/'), { allow }, 3);

    expect(result.final.toString()).toBe('https://good.example/');
    expect(result.hops).toBe(1);
    expect(mocks.pinnedRequestMock).toHaveBeenCalledTimes(3);

    const secondCall = mocks.pinnedRequestMock.mock.calls[1]?.[0] as { method: string; headers: Record<string, string> } | undefined;
    expect(secondCall?.method).toBe('GET');
    expect(secondCall?.headers?.range).toBe('bytes=0-0');
  });
});
