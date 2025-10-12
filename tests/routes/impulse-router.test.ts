import request from 'supertest';
import express from 'express';

import impulseRouter, { impulseMetrics } from '../../packages/agent/src/routes/impulse';

describe('impulseRouter (root tests)', () => {
  it('stores metric value and returns ok', async () => {
    const app = express();
    app.use(express.json());
    app.use(impulseRouter);
    const res = await request(app).post('/impulse/3/crep').send({ value: 0.5 });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(impulseMetrics['3']).toContain(0.5);
  });
});
