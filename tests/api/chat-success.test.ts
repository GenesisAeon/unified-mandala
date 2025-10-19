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

function hashBody(body: unknown): string {
  if (typeof body === 'string') {
    return crypto.createHash('sha256').update(body).digest('hex');
  }
  try {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(body ?? {}))
      .digest('hex');
  } catch {
    return crypto
      .createHash('sha256')
      .update(String(body ?? ''))
      .digest('hex');
  }
}

function fingerprint({
  reqId,
  method,
  path,
  bodyHash,
  evidenceDomains,
  boundaryHits,
}: {
  reqId: string;
  method: string;
  path: string;
  bodyHash: string;
  evidenceDomains: string[];
  boundaryHits: string[];
}): string {
  const payload = JSON.stringify({
    v: 1,
    r: reqId,
    m: method.toUpperCase(),
    p: path,
    b: bodyHash,
    d: [...new Set(evidenceDomains)].sort(),
    bh: [...new Set(boundaryHits)].sort(),
  });
  return crypto.createHash('sha256').update(payload).digest('hex');
}

function signToken(
  path: string,
  body: unknown,
  options?: { method?: string; evidenceCount?: number },
): string {
  const method = (options?.method ?? 'POST').toUpperCase();
  const evidenceCount = options?.evidenceCount ?? 2;
  const requestId = 'test-request';
  const bodyHash = hashBody(body);
  const evidenceDomains: string[] = [];
  const boundaryHits: string[] = [];
  const fp = fingerprint({
    reqId: requestId,
    method,
    path,
    bodyHash,
    evidenceDomains,
    boundaryHits,
  });
  const pathHash = crypto.createHash('sha1').update(`${method}:${path}`).digest('hex');
  const issuedAt = Math.floor(Date.now() / 1000);
  return jwt.sign(
    {
      iss: 'verify-gate',
      sub: 'tester',
      aud: path,
      v: 'green',
      ec: evidenceCount,
      rid: requestId,
      pth: pathHash,
      fp,
      ch: bodyHash,
      ed: evidenceDomains,
      bh: boundaryHits,
      jti: 'test-jti',
      iat: issuedAt,
      exp: issuedAt + 60,
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
      .set('x-ethics-token', signToken('/api/ai/chat', body))
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
      .set('x-ethics-token', signToken('/api/ai/chat', body))
      .send(body);
    expect(res.status).toBe(500);
    expect(res.body.error).toContain('upstream failed');
  });
});
