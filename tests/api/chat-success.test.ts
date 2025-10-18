import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import request from 'supertest';

const responsesCreateMock = vi.hoisted(() =>
  vi.fn(async () => ({
    output_text: 'hello from mock',
    model: 'gpt-4.1-mini',
    usage: { total_tokens: 3 },
    output: [
      { content: [{ type: 'output_text', text: 'hello from mock' }], finish_reason: 'stop' },
    ],
  })),
);

class TestOpenAIClient {
  responses = { create: responsesCreateMock } as any;
}

// Import app after setting the mock
let app: import('express').Express;
beforeAll(async () => {
  process.env.VERIFY_GATE_JWT_SECRET = 'test-secret';
  const api = await import('../../apps/api/src/index');
  app = api.app;
});

function signToken(path: string, method = 'POST', evidenceCount = 2): string {
  const hash = crypto.createHash('sha1');
  hash.update(`${method}:${path}`);
  return jwt.sign(
    {
      v: 'green',
      ec: evidenceCount,
      rid: 'test-request',
      pth: hash.digest('hex'),
      exp: Math.floor(Date.now() / 1000) + 60,
    },
    'test-secret',
    { algorithm: 'HS256', noTimestamp: true },
  );
}

describe('API /api/ai/chat success (direct transport)', () => {
  beforeEach(() => {
    delete process.env.AI_TRANSPORT; // ensure "direct"
    // Inject test OpenAI client to avoid real network or API key
    (globalThis as any).__UM_TEST_OPENAI_CLIENT = new TestOpenAIClient();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 200 and forwards askOpenAI result', async () => {
    const body = { messages: [{ role: 'user', content: 'hi' }] };
    const res = await request(app)
      .post('/api/ai/chat')
      .set('x-ethics-token', signToken('/api/ai/chat'))
      .send(body);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      text: 'hello from mock',
      model: 'gpt-4.1-mini',
    });
    expect(responsesCreateMock.mock.calls.length).toBe(1);
  });

  it('returns 500 when askOpenAI throws', async () => {
    responsesCreateMock.mockImplementationOnce(async () => {
      throw new Error('upstream failed');
    });
    const body = { messages: [{ role: 'user', content: 'x' }] };
    const res = await request(app)
      .post('/api/ai/chat')
      .set('x-ethics-token', signToken('/api/ai/chat'))
      .send(body);
    expect(res.status).toBe(500);
    expect(res.body.error).toContain('upstream failed');
  });
});
