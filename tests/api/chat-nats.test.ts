import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

function signToken(path: string, method = 'POST'): string {
  const hash = crypto.createHash('sha1');
  hash.update(`${method}:${path}`);
  return jwt.sign(
    {
      v: 'green',
      ec: 2,
      rid: 'nats-test',
      pth: hash.digest('hex'),
      exp: Math.floor(Date.now() / 1000) + 60,
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
    const res = await request(app)
      .post('/api/ai/chat')
      .set('x-ethics-token', signToken('/api/ai/chat'))
      .send({ messages: [{ role: 'user', content: 'hi' }] });
    expect(res.status).toBe(200);
    expect(res.body.text).toBe('nats-ok');
    expect(natsMod.requestAI).toHaveBeenCalledTimes(1);
  });

  it('propagates errors as 500', async () => {
    (natsMod.requestAI as any).mockRejectedValueOnce(new Error('nats-fail'));
    const res = await request(app)
      .post('/api/ai/chat')
      .set('x-ethics-token', signToken('/api/ai/chat'))
      .send({ messages: [{ role: 'user', content: 'x' }] });
    expect(res.status).toBe(500);
    expect(res.body.error).toContain('nats-fail');
    expect(natsMod.requestAI).toHaveBeenCalledTimes(1);
  });
});
