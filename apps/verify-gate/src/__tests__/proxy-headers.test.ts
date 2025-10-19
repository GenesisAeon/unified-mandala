import { AddressInfo } from 'node:net';
import express from 'express';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

function headerToString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value.join(',');
  }
  return value ?? '';
}

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

describe('verify gate header forwarding', () => {
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
    process.env.PORT_OFFSET = '0';
    process.env.VERIFY_GATE_TIMEOUT_MS = '200';
    process.env.VERIFY_GATE_RPS = '500';
    process.env.VERIFY_GATE_JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
  });

  test('forwards authentication headers and emits ethics verdict metadata', async () => {
    const ethicsApp = express();
    ethicsApp.use(express.json());
    ethicsApp.post('/ethics/check', (_req, res) => {
      res.json({ ok: true, verdict: 'green', reason: 'grounded', neededEvidence: [] });
    });
    const ethics = await startServer(ethicsApp);

    const upstreamApp = express();
    upstreamApp.use(express.json());
    let receivedHeaders: Partial<Record<string, string | string[]>> | null = null;
    upstreamApp.post('/secure', (req, res) => {
      receivedHeaders = req.headers;
      res.json({ ok: true, echo: req.body });
    });
    const upstream = await startServer(upstreamApp);

    process.env.VERIFY_ETHICS_URL = `${ethics.url}`;
    process.env.VERIFY_UPSTREAM_URL = `${upstream.url}`;
    process.env.VERIFY_GATE_UPSTREAM_ALLOWLIST = new URL(upstream.url).host;

    const { app } = await import('../index');

    try {
      const response = await request(app)
        .post('/gate/secure')
        .set('authorization', 'Bearer abc123')
        .set('cookie', 'session=xyz; theme=light')
        .set('x-forwarded-for', '1.1.1.1')
        .send({ foo: 'bar' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ok: true, echo: { foo: 'bar' } });
      expect(response.headers['x-ethics-verdict']).toBe('green');
      expect(response.headers['x-ethics-evidence-count']).toBe('0');
      expect(response.headers['access-control-expose-headers']).toContain('x-ethics-verdict');

      expect(receivedHeaders).not.toBeNull();
      if (!receivedHeaders) {
        throw new Error('headers were not captured');
      }
      const headers = receivedHeaders;
      expect(headers['authorization']).toBe('Bearer abc123');
      const cookieValue = headerToString(headers['cookie']);
      expect(cookieValue).toContain('session=xyz');
      const forwardedFor = headerToString(headers['x-forwarded-for']);
      expect(forwardedFor).toContain('1.1.1.1');
    } finally {
      await ethics.close();
      await upstream.close();
    }
  });
});
