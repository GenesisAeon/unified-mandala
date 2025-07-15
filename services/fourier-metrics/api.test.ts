import { TextEncoder } from 'util';
(global as any).TextEncoder = TextEncoder;
import request from 'supertest';
import { createApp } from './api';

const app = createApp();

describe('Fourier API', () => {
  it('returns metrics for data', async () => {
    const res = await request(app)
      .post('/api/fourier/analyze')
      .send({ data: [1, 0, 1, 0] });
    expect(res.body.metrics.maxAmplitude).toBeGreaterThan(0);
    expect(Array.isArray(res.body.amplitudes)).toBe(true);
  });

  it('validates payload', async () => {
    const res = await request(app).post('/api/fourier/analyze').send({});
    expect(res.status).toBe(400);
  });
});
