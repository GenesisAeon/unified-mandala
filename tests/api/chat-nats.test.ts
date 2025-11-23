import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

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

function signToken(path: string, body: unknown, method = 'POST'): string {
  const upperMethod = method.toUpperCase();
  const requestId = 'nats-test';
  const bodyHash = hashBody(body);
  const evidenceDomains: string[] = [];
  const boundaryHits: string[] = [];
  const fp = fingerprint({
    reqId: requestId,
    method: upperMethod,
    path,
    bodyHash,
    evidenceDomains,
    boundaryHits,
  });
  const pathHash = crypto.createHash('sha1').update(`${upperMethod}:${path}`).digest('hex');
  const issuedAt = Math.floor(Date.now() / 1000);
  return jwt.sign(
    {
      iss: 'verify-gate',
      sub: 'tester-nats',
      aud: path,
      v: 'green',
      ec: 2,
      rid: requestId,
      pth: pathHash,
      fp,
      ch: bodyHash,
      ed: evidenceDomains,
      bh: boundaryHits,
      jti: 'nats-jti',
      iat: issuedAt,
      exp: issuedAt + 60,
    },
    'test-secret',
    { algorithm: 'HS256', noTimestamp: true },
  );
}

describe('API /api/ai/chat via NATS transport', () => {
  let app: any;
  let natsMod: any;

  beforeEach(async () => {
    process.env.AI_TRANSPORT = 'nats';
    process.env.VERIFY_GATE_JWT_SECRET = 'test-secret';
    vi.resetModules();
    (globalThis as any).__UM_TEST_EXPRESS_APP = undefined;
    vi.unmock('express');
    natsMod = await import('../../apps/api/src/natsClient');
    vi.spyOn(natsMod, 'requestAI');
    ({ app } = await import('../../apps/api/src/index'));
  });

  afterEach(() => {
    delete process.env.AI_TRANSPORT;
    delete process.env.VERIFY_GATE_JWT_SECRET;
    vi.restoreAllMocks();
  });

  it('uses requestAI and returns its result', async () => {
    (natsMod.requestAI as any).mockResolvedValueOnce({ text: 'nats-ok', model: 'mock' });
    const body = { messages: [{ role: 'user', content: 'hi' }] };
    const res = await request(app)
      .post('/api/ai/chat')
      .set('x-ethics-token', signToken('/api/ai/chat', body))
      .send(body);
    expect(res.status).toBe(200);
    expect(res.body.text).toBe('nats-ok');
    expect(natsMod.requestAI).toHaveBeenCalledTimes(1);
  });

  it('propagates errors as 500', async () => {
    (natsMod.requestAI as any).mockRejectedValueOnce(new Error('nats-fail'));
    const body = { messages: [{ role: 'user', content: 'x' }] };
    const res = await request(app)
      .post('/api/ai/chat')
      .set('x-ethics-token', signToken('/api/ai/chat', body))
      .send(body);
    expect(res.status).toBe(500);
    expect(res.body.error).toContain('nats-fail');
    expect(natsMod.requestAI).toHaveBeenCalledTimes(1);
  });
});
