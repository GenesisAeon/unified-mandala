import request from 'supertest';
import express from 'express';
import fourierRouter from './fourier';

describe('fourierRouter', () => {
  it('returns metrics from posted data', async () => {
    const app = express();
    app.use(express.json());
    app.use(fourierRouter);
    const res = await request(app)
      .post('/fourier/analyze')
      .send({ data: [1,0,-1,0], depth: 1 });
    expect(res.body.maxAmplitude).toBeGreaterThan(0);
  });
});
