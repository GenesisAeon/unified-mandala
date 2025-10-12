import request from 'supertest';
import express from 'express';

// Import the router under test
import fourierRouter from '../src/routes/fourier';

describe('packages/agent fourierRouter', () => {
  it('returns metrics from posted data', async () => {
    const app = express();
    app.use(express.json());
    app.use(fourierRouter);

    const res = await request(app)
      .post('/fourier/analyze')
      .send({ data: [1, 0, -1, 0], depth: 1 });

    expect(res.status).toBe(200);
    expect(res.body.maxAmplitude).toBeGreaterThan(0);
    expect(typeof res.body.count === 'number' || res.body.count === undefined).toBe(true);
  });

  it('400 for missing/invalid data array', async () => {
    const app = express();
    app.use(express.json());
    app.use(fourierRouter);

    const res = await request(app).post('/fourier/analyze').send({});
    expect(res.status).toBe(400);
  });
});

