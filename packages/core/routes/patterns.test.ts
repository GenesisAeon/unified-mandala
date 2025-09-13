/** @jest-environment node */
import { TextEncoder } from 'util';
(global as any).TextEncoder = TextEncoder;
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import patternRoutes from './patterns';
import metricsRoutes from './metrics';
import { REG } from '../../../src/metrics/singleton';
import fs from 'fs';

const SECRET = 'test-secret';
const token = jwt.sign({ id: 'u1' }, SECRET);
const app = express();
app.use(metricsRoutes);
app.use('/patterns', patternRoutes(SECRET));

beforeEach(() => {
  if (fs.existsSync('plugins/mandalaHaiku/customPatterns.json')) {
    fs.writeFileSync('plugins/mandalaHaiku/customPatterns.json', '[]');
  }
  REG.resetMetrics();
});

describe('Community-Pattern API', () => {
  it('GET /patterns returns array', async () => {
    const res = await request(app).get('/patterns').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /patterns adds new pattern', async () => {
    const res = await request(app)
      .post('/patterns')
      .set('Authorization', `Bearer ${token}`)
      .send({ pattern: 'Ein neuer poetischer Kreis erwacht im Licht.' });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Pattern added');
  });

  it('increments patterns_created_total metric', async () => {
    await request(app)
      .post('/patterns')
      .set('Authorization', `Bearer ${token}`)
      .send({ pattern: 'Ein neuer poetischer Kreis erwacht im Licht.' });
    const res = await request(app).get('/metrics');
    expect(res.text).toContain('patterns_created_total 1');
  });
});
