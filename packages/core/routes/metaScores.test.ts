import { TextEncoder } from 'util';
// polyfill for Node versions lacking TextEncoder
global.TextEncoder = TextEncoder;
import request from 'supertest';
import express from 'express';
import metaScores from './metaScores';
import impulseRouter, { impulseMetrics } from '../../agent/src/routes/impulse';

const app = express();
app.use(express.json());
app.use(impulseRouter);
app.use(metaScores);

beforeEach(() => {
  for (const key in impulseMetrics) delete impulseMetrics[key];
});

describe('metaScores route', () => {
  it('returns empty scores', async () => {
    const res = await request(app).get('/api/meta-scores');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ scores: [] });
  });

  it('returns average resonance for impulses', async () => {
    await request(app).post('/impulse/1/crep').send({ value: 0.5 });
    await request(app).post('/impulse/1/crep').send({ value: 1.0 });
    const res = await request(app).get('/api/meta-scores');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ scores: [{ idx: '1', avgResonance: 0.75 }] });
  });
});
