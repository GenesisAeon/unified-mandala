import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';

vi.mock('@unified-mandala/ai', () => ({
  askOpenAI: vi.fn(async () => ({ text: 'ok', model: 'mock', usage: { total_tokens: 1 } })),
}));

let app: import('express').Express;

const ORIGINAL_ENV = { ...process.env } as NodeJS.ProcessEnv;

function makeToken(path: string, method = 'POST', verdict: 'green' | 'yellow' | 'red' = 'green', kid = 'kidA') {
  const hash = crypto.createHash('sha1');
  hash.update(`${method}:${path}`);
  return jwt.sign(
    {
      v: verdict,
      ec: 2,
      rid: 'guard-test',
      pth: hash.digest('hex'),
      exp: Math.floor(Date.now() / 1000) + 60,
    },
    'guard-secret',
    { algorithm: 'HS256', noTimestamp: true, header: kid ? { kid } : undefined },
  );
}

beforeAll(async () => {
  process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
  process.env.VERIFY_GATE_JWT_SECRETS = `kidA:${Buffer.from('guard-secret').toString('base64')}`;
  process.env.VERIFY_GATE_JWT_ACTIVE_KID = 'kidA';
  delete process.env.VERIFY_GATE_JWT_SECRET;
  const mod = await import('../index');
  app = mod.app;
});

afterAll(() => {
  process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
});

beforeEach(() => {
  (globalThis as any).__UM_TEST_OPENAI_CLIENT = {
    responses: {
      create: vi.fn(async () => ({
        output_text: 'stub',
        model: 'mock',
        usage: { total_tokens: 1 },
        output: [
          { content: [{ type: 'output_text', text: 'stub' }], finish_reason: 'stop' },
        ],
      })),
    },
  };
});

describe('verifyEthics middleware', () => {
  it('rejects requests without token', async () => {
    const res = await request(app).post('/api/ai/chat').send({ messages: [{ role: 'user', content: 'hi' }] });
    expect(res.status).toBe(428);
    expect(res.body.reason).toBe('missing_ethics_token');
  });

  it('rejects non-green or mismatched tokens', async () => {
    const badToken = makeToken('/api/ai/chat', 'POST', 'yellow');
    const res = await request(app)
      .post('/api/ai/chat')
      .set('x-ethics-token', badToken)
      .send({ messages: [{ role: 'user', content: 'hi' }] });
    expect(res.status).toBe(428);
    expect(res.body.reason).toBe('ethics_verification_failed');
  });

  it('accepts valid tokens and forwards to handler', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .set('x-ethics-token', makeToken('/api/ai/chat'))
      .send({ messages: [{ role: 'user', content: 'hi' }] });
    expect(res.status).toBe(200);
    expect(res.headers['x-ethics-verdict']).toBe('green');
    expect(res.headers['x-ethics-evidence-count']).toBe('2');
  });
});
