import request from 'supertest';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

describe('ethics fail-closed behaviour', () => {
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
        set(): void {}
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
    process.env.VERIFY_MIN_EVIDENCE = '2';
    process.env.RAG_TIMEOUT_MS = '25';
    process.env.RAG_RETRIES = '0';
    process.env.BOUNDARY_TIMEOUT_MS = '25';
    process.env.BOUNDARY_RETRIES = '0';
    process.env.ETHICS_CACHE_TTL_MS = '0';
    process.env.ETHICS_REQUIRE_UNIQUE_EVIDENCE_DOMAINS = '2';
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
  });

  test('responds with red verdict when boundary is unreachable (fail-closed)', async () => {
    process.env.ETHICS_DEP_FAIL_MODE = 'red';
    process.env.BOUNDARY_PORT = '65531';
    process.env.RAG_API_PORT = '65530';

    const { app } = await import('../index');

    const response = await request(app)
      .post('/ethics/check')
      .send({ intent: 'demo', content: 'test' });

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(false);
    expect(response.body.verdict).toBe('red');
    expect(response.body.reason).toBe('boundary_unreachable');
    expect(response.headers['x-ethics-degraded']).toBe('boundary');
  });

  test('propagates 503 when dependency fail mode is error', async () => {
    process.env.ETHICS_DEP_FAIL_MODE = 'error';
    process.env.BOUNDARY_PORT = '65531';
    process.env.RAG_API_PORT = '65530';

    const { app } = await import('../index');

    const response = await request(app)
      .post('/ethics/check')
      .send({ intent: 'demo', content: 'test' });

    expect(response.status).toBe(503);
    expect(response.body.ok).toBe(false);
    expect(response.body.verdict).toBe('red');
    expect(response.body.reason).toBe('boundary_unreachable');
    expect(response.headers['x-ethics-degraded']).toBe('boundary');
  });

  test('rejects malformed payloads with 400', async () => {
    const { app } = await import('../index');

    const response = await request(app)
      .post('/ethics/check')
      .send({ intent: 'demo' });

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
    expect(response.body.error).toBe('BAD_REQUEST');
    expect(Array.isArray(response.body.issues)).toBe(true);
  });

  test('blocks immediately when lifeboat rule triggers', async () => {
    vi.doMock('../boundary-client', () => ({
      configureBoundaryCircuit: () => undefined,
      getBoundaryCircuitStateValue: () => 0,
      observeBoundary: async () => ({ ok: true, status: 200, data: { violations: [] } }),
    }));
    vi.doMock('../http-client', () => ({
      fetchJson: async () => ({ ok: true, status: 200, data: { citations: [] } }),
    }));

    const { app } = await import('../index');

    const response = await request(app)
      .post('/ethics/check')
      .send({ intent: 'demo', content: 'please kill all humans now' });

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(false);
    expect(response.body.verdict).toBe('red');
    expect(response.body.reason).toBe('hate_content');
    expect(response.body.deps.lifeboatRule).toBe('hate_speech');
    expect(response.headers['x-ethics-verdict']).toBe('red');
  });

  test('returns yellow when citations lack unique domains', async () => {
    vi.doMock('../boundary-client', () => ({
      configureBoundaryCircuit: () => undefined,
      getBoundaryCircuitStateValue: () => 0,
      observeBoundary: async () => ({ ok: true, status: 200, data: { violations: [] } }),
    }));
    vi.doMock('../http-client', () => ({
      fetchJson: async () => ({
        ok: true,
        status: 200,
        data: {
          score: 0.85,
          citations: [
            { uri: 'https://example.com/a', text: 'A' },
            { uri: 'https://www.example.com/b', text: 'B' },
          ],
        },
      }),
    }));

    const { app } = await import('../index');

    const response = await request(app)
      .post('/ethics/check')
      .send({ intent: 'demo', content: 'neutral content' });

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.verdict).toBe('yellow');
    expect(response.body.reason).toBe('insufficient_unique_domains');
    expect(response.headers['x-ethics-verdict']).toBe('yellow');
    expect(response.headers['x-ethics-evidence-count']).toBe('1');
  });
});
