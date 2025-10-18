import { AddressInfo } from 'node:net';
import express from 'express';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

async function startServer(app: express.Express): Promise<{ url: string; close: () => Promise<void> }> {
  return await new Promise((resolve) => {
    const server = app.listen(0, () => {
      const address = server.address() as AddressInfo;
      const url = `http://127.0.0.1:${address.port}`;
      resolve({
        url,
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

describe('verify gate streaming proxy', () => {
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
      return {
        collectDefaultMetrics: () => undefined,
        Counter: MockCounter,
        Gauge: MockGauge,
        Histogram: MockHistogram,
        Registry: MockRegistry,
      };
    });
    process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
    process.env.NODE_ENV = 'test';
    process.env.PORT_OFFSET = '0';
    process.env.VERIFY_GATE_TIMEOUT_MS = '200';
    process.env.VERIFY_GATE_RPS = '500';
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
  });

  test('retains ethics headers on streamed responses', async () => {
    const ethicsApp = express();
    ethicsApp.use(express.json());
    ethicsApp.post('/ethics/check', (_req, res) => {
      res.json({ ok: true, verdict: 'green', reason: 'grounded', neededEvidence: [] });
    });
    const ethics = await startServer(ethicsApp);

    const upstreamApp = express();
    upstreamApp.post('/stream', (_req, res) => {
      res.setHeader('content-type', 'text/plain');
      res.write('chunk-one');
      res.write('-chunk-two');
      res.end();
    });
    const upstream = await startServer(upstreamApp);

    process.env.VERIFY_ETHICS_URL = ethics.url;
    process.env.VERIFY_UPSTREAM_URL = upstream.url;
    process.env.VERIFY_GATE_UPSTREAM_ALLOWLIST = new URL(upstream.url).host;

    const { app } = await import('../index');

    try {
      const response = await request(app).post('/gate/stream').send({ demo: true });
      expect(response.status).toBe(200);
      expect(response.text).toBe('chunk-one-chunk-two');
      expect(response.headers['x-ethics-verdict']).toBe('green');
      expect(response.headers['x-ethics-evidence-count']).toBe('0');
      expect(response.headers['access-control-expose-headers']).toContain('x-ethics-verdict');
    } finally {
      await ethics.close();
      await upstream.close();
    }
  });
});
