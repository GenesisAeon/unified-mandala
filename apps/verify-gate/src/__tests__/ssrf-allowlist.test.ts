import express from 'express';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

describe('verify gate SSRF allowlist', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.mock('helmet', () => ({
      default: () => (_req: unknown, _res: unknown, next: () => void) => next(),
      __esModule: true,
    }));
    vi.mock('prom-client', () => {
      class MockCounter {
        inc(): void {}
      }
      class MockGauge {
        inc(): void {}
        dec(): void {}
      }
      class MockHistogram {
        labels(): { observe: () => void } {
          return { observe: () => {} };
        }
        startTimer(): () => void {
          return () => {};
        }
      }
      class MockRegistry {
        public contentType = 'text/plain';
        async metrics(): Promise<string> {
          return '';
        }
      }
      const module = {
        collectDefaultMetrics: () => undefined,
        Counter: MockCounter,
        Gauge: MockGauge,
        Histogram: MockHistogram,
        Registry: MockRegistry,
      };
      return {
        __esModule: true,
        default: module,
        ...module,
      };
    });
    process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
    delete process.env.VERIFY_GATE_SSRF_ALLOWLIST;
    process.env.NODE_ENV = 'test';
    process.env.PORT_OFFSET = '0';
    process.env.VERIFY_GATE_TIMEOUT_MS = '200';
    process.env.VERIFY_GATE_RPS = '500';
    process.env.VERIFY_GATE_JWT_SECRET = 'test-secret';
    process.env.VERIFY_ETHICS_URL = 'http://127.0.0.1:65530';
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
  });

  test('rejects upstream targets not on the allowlist', async () => {
    const ethicsApp = express();
    ethicsApp.use(express.json());
    ethicsApp.post('/ethics/check', (_req, res) => {
      res.json({ ok: true, verdict: 'green', reason: 'grounded', neededEvidence: [] });
    });
    const ethicsServer = ethicsApp.listen(0);
    const ethicsPort = (ethicsServer.address() as { port: number }).port;
    process.env.VERIFY_ETHICS_URL = `http://127.0.0.1:${ethicsPort}`;

    process.env.VERIFY_UPSTREAM_URL = 'http://127.0.0.1:65531';
    process.env.VERIFY_GATE_UPSTREAM_ALLOWLIST = '127.0.0.1:65530';

    const { app } = await import('../index');

    try {
      const response = await request(app).post('/gate/demo').send({ demo: true });
      expect(response.status).toBe(403);
      expect(response.body.ok).toBe(false);
      expect(response.body.error).toBe('upstream_not_allowlisted');
    } finally {
      await new Promise<void>((resolve, reject) => {
        ethicsServer.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  });
});

describe('ssrf allowlist parsing', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
  });

  test('allows wildcard loopback entries from VERIFY_GATE_SSRF_ALLOWLIST', async () => {
    process.env.VERIFY_GATE_SSRF_ALLOWLIST = 'http://127.0.0.1:*';
    process.env.VERIFY_GATE_ALLOW_PROTOCOLS = 'http';
    const mod = await import('../security/ssrf');
    await expect(mod.assertAllowed('http://127.0.0.1:43210')).resolves.not.toThrow();
  });
});
