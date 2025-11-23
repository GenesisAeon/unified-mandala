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

const defaultBody = { messages: [{ role: 'user', content: 'hi' }] };

function bodySha256(body: unknown): string {
  if (typeof body === 'string') {
    return crypto.createHash('sha256').update(body).digest('hex');
  }
  return crypto.createHash('sha256').update(JSON.stringify(body ?? {})).digest('hex');
}

function verdictFingerprint(method: string, path: string, bodyHash: string, evidenceDomains: string[], boundaryHits: string[]) {
  const payload = JSON.stringify({
    v: 1,
    r: 'guard-test',
    m: method.toUpperCase(),
    p: path,
    b: bodyHash,
    d: [...new Set(evidenceDomains)].sort(),
    bh: [...new Set(boundaryHits)].sort(),
  });
  return crypto.createHash('sha256').update(payload).digest('hex');
}

function makeToken(
  path: string,
  method = 'POST',
  verdict: 'green' | 'yellow' | 'red' = 'green',
  kid = 'kidA',
  secret = 'guard-secret',
  body: unknown = defaultBody,
) {
  const pathHash = crypto.createHash('sha1').update(`${method}:${path}`).digest('hex');
  const bodyHash = bodySha256(body);
  const evidenceDomains = ['doi.org'];
  const boundaryHits: string[] = [];
  const fingerprint = verdictFingerprint(method, path, bodyHash, evidenceDomains, boundaryHits);
  const now = Math.floor(Date.now() / 1000);
  return jwt.sign(
    {
      iss: 'verify-gate',
      sub: 'auth:test',
      aud: path,
      v: verdict,
      ec: 2,
      rid: 'guard-test',
      pth: pathHash,
      fp: fingerprint,
      ch: bodyHash,
      ed: evidenceDomains,
      bh: boundaryHits,
      jti: 'test-jti',
      iat: now,
      exp: now + 60,
    },
    secret,
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

describe('kid rotation', () => {
  it('accepts legacy kid during rotation window and rejects after removal', async () => {
    const originalSecrets = process.env.VERIFY_GATE_JWT_SECRETS;
    const originalActive = process.env.VERIFY_GATE_JWT_ACTIVE_KID;
    const originalFallback = process.env.VERIFY_GATE_JWT_SECRET;
    const kidASecret = 'legacy-secret';
    const kidBSecret = 'next-secret';

    try {
      process.env.VERIFY_GATE_JWT_SECRETS = `kidA:${Buffer.from(kidASecret).toString('base64')},kidB:${Buffer.from(kidBSecret).toString('base64')}`;
      process.env.VERIFY_GATE_JWT_ACTIVE_KID = 'kidB';
      delete process.env.VERIFY_GATE_JWT_SECRET;

      const resNewKid = await request(app)
        .post('/api/ai/chat')
        .set('x-ethics-token', makeToken('/api/ai/chat', 'POST', 'green', 'kidB', kidBSecret))
        .send({ messages: [{ role: 'user', content: 'hi' }] });
      expect(resNewKid.status).toBe(200);

      const resLegacyKid = await request(app)
        .post('/api/ai/chat')
        .set('x-ethics-token', makeToken('/api/ai/chat', 'POST', 'green', 'kidA', kidASecret))
        .send({ messages: [{ role: 'user', content: 'hi' }] });
      expect(resLegacyKid.status).toBe(200);

      process.env.VERIFY_GATE_JWT_SECRETS = `kidB:${Buffer.from(kidBSecret).toString('base64')}`;

      const resLegacyAfterDrop = await request(app)
        .post('/api/ai/chat')
        .set('x-ethics-token', makeToken('/api/ai/chat', 'POST', 'green', 'kidA', kidASecret))
        .send({ messages: [{ role: 'user', content: 'hi' }] });
      expect(resLegacyAfterDrop.status).toBe(428);
      expect(resLegacyAfterDrop.body.reason).toBe('ethics_verification_failed');
    } finally {
      process.env.VERIFY_GATE_JWT_SECRETS = originalSecrets;
      if (originalActive) {
        process.env.VERIFY_GATE_JWT_ACTIVE_KID = originalActive;
      } else {
        delete process.env.VERIFY_GATE_JWT_ACTIVE_KID;
      }
      if (originalFallback) {
        process.env.VERIFY_GATE_JWT_SECRET = originalFallback;
      } else {
        delete process.env.VERIFY_GATE_JWT_SECRET;
      }
    }
  });
});
