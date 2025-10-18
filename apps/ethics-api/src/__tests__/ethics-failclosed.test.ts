import request from 'supertest';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

declare module '../index' {
  export const app: import('express').Express;
}

const ORIGINAL_ENV = { ...process.env };

describe('ethics fail-closed behaviour', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.mock('prom-client', () => {
      class MockCounter {
        inc(): void {}
      }
      class MockGauge {
        set(): void {}
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
    process.env.VERIFY_MIN_EVIDENCE = '2';
    process.env.RAG_TIMEOUT_MS = '25';
    process.env.RAG_RETRIES = '0';
    process.env.BOUNDARY_TIMEOUT_MS = '25';
    process.env.BOUNDARY_RETRIES = '0';
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
  });
});
