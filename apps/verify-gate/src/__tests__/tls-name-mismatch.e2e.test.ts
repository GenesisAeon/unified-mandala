import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { Registry } from 'prom-client';

const fetchMock = vi.fn();

vi.mock('helmet', () => ({
  default: () => (_req: unknown, _res: unknown, next: () => void) => next(),
  __esModule: true,
}));

vi.mock('better-sqlite3', () => ({
  default: class Database {
    pragma(): void {}
    exec(): void {}
    prepare() {
      return {
        run: () => ({ changes: 1 }),
        get: () => undefined,
      };
    }
  },
  __esModule: true,
}));

vi.mock('undici', async (orig) => {
  const actual = await orig<typeof import('undici')>();
  return {
    ...actual,
    fetch: fetchMock,
  };
});

vi.mock('../security/ssrf.js', async (orig) => {
  const actual = await orig<typeof import('../security/ssrf.js')>();
  return {
    ...actual,
    hasAllowlistEntries: () => true,
    assertAllowed: vi.fn(async (target: string) => {
      const url = new URL(target);
      return {
        ip: '203.0.113.10',
        ips: ['203.0.113.10'],
        minTTLsec: 60,
        chain: [url.hostname],
        hostname: url.hostname,
        url,
      };
    }),
  };
});

vi.mock('../proxy/followRedirects.js', () => ({
  followRedirectsWithPreflight: vi.fn(async (start: URL, ctx: { allow: { url: URL } }) => ({
    final: new URL(start.toString()),
    hops: 0,
    ctx,
    schemeHistory: [start.protocol.replace(/:$/, '')],
  })),
  followRedirects: vi.fn(async (start: URL, ctx: { allow: { url: URL } }) => ({
    final: new URL(start.toString()),
    hops: 0,
    ctx,
    schemeHistory: [start.protocol.replace(/:$/, '')],
  })),
}));

vi.mock('../security/tlsPreflight.js', () => ({
  tlsPreflight: vi.fn(async () => ({ remoteAddress: '203.0.113.10', sanOk: true })),
}));

vi.mock('../proxy/pinnedRequest.js', () => ({
  pinnedRequest: vi.fn(async (opts: { originalUrl: URL; method?: string }) => {
    if (opts.method === 'HEAD') {
      return {
        res: { statusCode: 200, headers: {}, body: null },
        dispose: () => undefined,
        pipeTo: async () => undefined,
      };
    }
    const { TlsNameMismatchError } = await import('../errors.js');
    throw new TlsNameMismatchError();
  }),
}));

describe('verify-gate metrics: TLS name mismatch', () => {
  beforeEach(() => {
    vi.resetModules();
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => null },
      json: async () => ({
        verdict: 'green',
        neededEvidence: [],
        boundary: { violations: [] },
        grounding: { citations: [] },
        evidence: { domains: [], strong: 0 },
      }),
    } as unknown);
    process.env.NODE_ENV = 'test';
    process.env.VERIFY_GATE_SSRF_ALLOWLIST = 'https://wrong-san.local';
    process.env.VERIFY_UPSTREAM_URL = 'https://wrong-san.local';
    process.env.VERIFY_ETHICS_URL = 'http://localhost:3110';
    process.env.VERIFY_GATE_JWT_SECRET = 'unit-test-secret';
  });

  afterEach(() => {
    delete process.env.VERIFY_GATE_SSRF_ALLOWLIST;
    delete process.env.VERIFY_UPSTREAM_URL;
    delete process.env.VERIFY_ETHICS_URL;
    delete process.env.VERIFY_GATE_JWT_SECRET;
  });

  it('increments verify_gate_tls_name_mismatch_total when upstream SAN fails', async () => {
    const { createApp } = await import('../app.js');
    const registry = new Registry();
    const app = createApp({ registry });

    const agent = request(app);
    await agent.post('/gate/probe').send({ intent: 'probe' }).expect(502);

    const metricsResponse = await agent.get('/metrics').expect(200);
    expect(metricsResponse.text).toMatch(/verify_gate_tls_name_mismatch_total(?:\{[^}]+\})?\s+1(\.0+)?/);
  });
});
