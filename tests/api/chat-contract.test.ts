import express from 'express';
import request from 'supertest';

import { verifyEthics } from '../../apps/api/src/middleware/verifyEthics';

function buildApp() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));
  app.post('/api/ai/chat', verifyEthics, (_req, res) => {
    res.status(200).json({ ok: true });
  });
  return app;
}

describe('AI Chat Contract - negative cases', () => {
  it('rejects plain text body (missing messages array)', async () => {
    await request(buildApp())
      .post('/api/ai/chat')
      .send({ text: 'hi' })
      .expect(428)
      .expect((res) => {
        expect(res.body.ok).toBe(false);
        expect(res.body.reason).toMatch(/missing|ethics/i);
      });
  });

  it('rejects empty messages array', async () => {
    await request(buildApp())
      .post('/api/ai/chat')
      .send({ messages: [] })
      .expect(428)
      .expect((res) => {
        expect(res.body.ok).toBe(false);
        expect(res.body.reason).toMatch(/missing|ethics/i);
      });
  });
});
