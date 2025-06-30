/** @jest-environment node */
import { TextEncoder } from 'util';
(global as any).TextEncoder = TextEncoder;
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import haikuRoutes from './haiku';
import metricsRoutes from './metrics';
import { register } from '../../../services/metrics';

const SECRET = 'test-secret';
const token = jwt.sign({ id: 'u1' }, SECRET);
const app = express();
app.use(metricsRoutes);
app.use('/api/haiku', haikuRoutes(SECRET));

beforeEach(() => {
  register.resetMetrics();
});

describe('Haiku vote API', () => {
  it('POST /api/haiku/vote stores vote', async () => {
    const res = await request(app)
      .post('/api/haiku/vote')
      .set('Authorization', `Bearer ${token}`)
      .send({ haiku: 'test', delta: 1 });
    expect(res.status).toBe(204);
  });

  it('increments haiku_votes_total metric', async () => {
    await request(app)
      .post('/api/haiku/vote')
      .set('Authorization', `Bearer ${token}`)
      .send({ haiku: 'test', delta: 1 });
    const res = await request(app).get('/metrics');
    expect(res.text).toContain('haiku_votes_total 1');
  });
});
