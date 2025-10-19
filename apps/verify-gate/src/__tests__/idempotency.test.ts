import express from 'express';
import request from 'supertest';
import { AddressInfo } from 'node:net';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

async function startServer(app: express.Express): Promise<{ url: string; close: () => Promise<void> }> {
  return await new Promise((resolve) => {
    const server = app.listen(0, () => {
      const address = server.address() as AddressInfo;
      resolve({
        url: `http://127.0.0.1:${address.port}`,
        close: async () =>
          await new Promise<void>((res, rej) => {
            server.close((err?: Error) => {
              if (err) {
                rej(err);
              } else {
                res();
              }
            });
          }),
      });
    });
  });
}

describe('verify gate idempotency guard', () => {
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
    process.env.NODE_ENV = 'test';
    process.env.VERIFY_GATE_TIMEOUT_MS = '250';
    process.env.VERIFY_GATE_RPS = '1000';
    process.env.VERIFY_GATE_IDEMP_TTL_MS = '5000';
    process.env.VERIFY_GATE_JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
  });

  it('returns 409 for duplicate requests with the same payload', async () => {
    const ethicsApp = express();
    ethicsApp.use(express.json());
    ethicsApp.post('/ethics/check', (_req, res) => {
      res.json({ ok: true, verdict: 'green', reason: 'grounded', neededEvidence: ['ref-a', 'ref-b'] });
    });
    const ethics = await startServer(ethicsApp);

    const upstreamApp = express();
    upstreamApp.use(express.json());
    upstreamApp.post('/dup', (_req, res) => {
      res.json({ ok: true });
    });
    const upstream = await startServer(upstreamApp);

    process.env.VERIFY_ETHICS_URL = `${ethics.url}`;
    process.env.VERIFY_UPSTREAM_URL = `${upstream.url}`;
    process.env.VERIFY_GATE_UPSTREAM_ALLOWLIST = new URL(upstream.url).host;

    const { app } = await import('../index');

    try {
      const first = await request(app).post('/gate/dup').send({ foo: 'bar' });
      expect(first.status).toBe(200);
      const requestId = first.headers['x-request-id'];
      expect(typeof requestId).toBe('string');

      const second = await request(app).post('/gate/dup').send({ foo: 'bar' });
      expect(second.status).toBe(409);
      expect(second.body.reason).toBe('duplicate');
      expect(second.headers['x-request-id']).toBe(requestId);
    } finally {
      await ethics.close();
      await upstream.close();
    }
  });
});
