import request from 'supertest';
import express from 'express';

import impulseRouter, { impulseMetrics } from '../src/routes/impulse';

describe('packages/agent impulseRouter', () => {
  it('stores metric value and returns ok', async () => {
    const app = express();
    app.use(express.json());
    app.use(impulseRouter);

    const res = await request(app).post('/impulse/1/crep').send({ value: 0.7 });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(impulseMetrics['1']).toContain(0.7);
  });

  it('rejects non-numeric value', async () => {
    const app = express();
    app.use(express.json());
    app.use(impulseRouter);

    const res = await request(app).post('/impulse/2/crep').send({ value: 'NaN' });
    expect(res.status).toBe(400);
  });
});

