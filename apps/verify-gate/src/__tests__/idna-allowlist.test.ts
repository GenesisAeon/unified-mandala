import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

describe('IDNA allowlist normalization', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
    vi.mock('../security/dnsCache.js', () => ({
      resolveWithCache: vi.fn(async () => ({
        ips: ['93.184.216.34'],
        minTTLsec: 120,
        chain: [],
        hostnameASCII: 'xn--bcher-kva.example',
      })),
      scheduleCacheMaintenance: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
  });

  it('matches unicode hosts against punycode allowlist entries', async () => {
    process.env.VERIFY_GATE_SSRF_ALLOWLIST = 'https://bücher.example';
    process.env.VERIFY_GATE_ALLOW_PROTOCOLS = 'https';
    const mod = await import('../security/ssrf.js');

    const result = await mod.assertAllowed('https://bücher.example/resource');
    expect(result.hostname).toBe('xn--bcher-kva.example');
    expect(result.ip).toBe('93.184.216.34');
  });
});
