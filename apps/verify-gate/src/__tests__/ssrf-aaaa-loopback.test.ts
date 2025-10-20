import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

let resolve4Mock: ReturnType<typeof vi.fn>;
let resolve6Mock: ReturnType<typeof vi.fn>;
let resolveCnameMock: ReturnType<typeof vi.fn>;

vi.mock('node:dns/promises', () => {
  return {
    __esModule: true,
    default: {
      resolve4: (...args: unknown[]) => resolve4Mock(...args),
      resolve6: (...args: unknown[]) => resolve6Mock(...args),
      resolveCname: (...args: unknown[]) => resolveCnameMock(...args),
    },
    resolve4: (...args: unknown[]) => resolve4Mock(...args),
    resolve6: (...args: unknown[]) => resolve6Mock(...args),
    resolveCname: (...args: unknown[]) => resolveCnameMock(...args),
  } as unknown as Partial<typeof import('node:dns/promises')> & {
    __esModule: true;
    default: Partial<typeof import('node:dns/promises')>;
  };
});

describe('SSRF guard denies AAAA-only loopback resolutions', () => {
  beforeEach(() => {
    vi.resetModules();
    resolve4Mock = vi.fn();
    resolve6Mock = vi.fn();
    resolveCnameMock = vi.fn();
    process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
    process.env.VERIFY_GATE_SSRF_ALLOWLIST = 'http://allowed.example.test';
    process.env.VERIFY_GATE_ALLOW_PROTOCOLS = 'http';
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
  });

  it('blocks when a hostname resolves exclusively to ::1', async () => {
    const notFound = Object.assign(new Error('notfound'), { code: 'ENOTFOUND' });
    resolve4Mock.mockRejectedValue(notFound);
    resolveCnameMock.mockResolvedValue([]);
    resolve6Mock.mockResolvedValue([{ address: '::1', ttl: 60 }]);

    const mod = await import('../security/ssrf');

    await expect(mod.assertAllowed('http://allowed.example.test/resource')).rejects.toHaveProperty(
      'message',
      'upstream_private_blocked',
    );
  });
});
