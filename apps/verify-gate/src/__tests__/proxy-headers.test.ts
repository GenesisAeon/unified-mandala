import { AddressInfo } from 'node:net';
import express from 'express';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

declare module '../index' {
  export const app: import('express').Express;
}

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

describe('verify gate header forwarding', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
    process.env.NODE_ENV = 'test';
    process.env.PORT_OFFSET = '0';
    process.env.VERIFY_GATE_TIMEOUT_MS = '200';
    process.env.VERIFY_RATE_RPS = '500';
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
    let receivedHeaders: Record<string, unknown> | null = null;
    upstreamApp.post('/secure', (req, res) => {
      receivedHeaders = req.headers;
      res.json({ ok: true, echo: req.body });
    });
    const upstream = await startServer(upstreamApp);

    process.env.VERIFY_ETHICS_URL = `${ethics.url}`;
    process.env.VERIFY_UPSTREAM_URL = `${upstream.url}`;

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
      expect((receivedHeaders as Record<string, unknown>)['authorization']).toBe('Bearer abc123');
      expect((receivedHeaders as Record<string, unknown>)['cookie']).toContain('session=xyz');
      const forwardedFor = String((receivedHeaders as Record<string, unknown>)['x-forwarded-for'] ?? '');
      expect(forwardedFor).toContain('1.1.1.1');
    } finally {
      await ethics.close();
      await upstream.close();
    }
  });
});
