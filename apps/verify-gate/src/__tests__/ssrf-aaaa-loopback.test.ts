import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

let lookupMock: ReturnType<typeof vi.fn>;

describe('SSRF guard denies AAAA-only loopback resolutions', () => {
  beforeEach(() => {
    vi.resetModules();
    lookupMock = vi.fn();
    vi.doMock('node:dns/promises', async () => {
      const actual = await vi.importActual<typeof import('node:dns/promises')>('node:dns/promises');
      return {
        ...actual,
        lookup: lookupMock as typeof actual.lookup,
      } satisfies Partial<typeof actual>;
    });
    process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
    process.env.VERIFY_GATE_SSRF_ALLOWLIST = 'http://allowed.example.test';
    process.env.VERIFY_GATE_ALLOW_PROTOCOLS = 'http';
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.unmock('node:dns/promises');
    process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
  });

  it('blocks when a hostname resolves exclusively to ::1', async () => {
    lookupMock.mockResolvedValue([{ address: '::1', family: 6 } as unknown]);

    const mod = await import('../security/ssrf');

    await expect(mod.assertAllowed('http://allowed.example.test/resource')).rejects.toHaveProperty(
      'message',
      'upstream_private_blocked',
    );
    expect(lookupMock).toHaveBeenCalledTimes(1);
  });
});
