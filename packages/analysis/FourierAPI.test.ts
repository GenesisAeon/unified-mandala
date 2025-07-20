import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createFourierAPI } from './FourierAPI';
import { FourierLayerEvents } from './FourierLayer';

describe('FourierAPI', () => {
  it('returns metrics', async () => {
    FourierLayerEvents.emit('metrics', { val: 1 });
    const app = createFourierAPI();
    const res = await request(app).get('/metrics');
    expect(res.body).toEqual({ val: 1 });
  });

  it('analyzes posted data', async () => {
    const app = createFourierAPI();
    const res = await request(app)
      .post('/analyze')
      .send({ id: 't', depth: 1, data: [1, 0, -1, 0] });
    expect(res.body.maxAmplitude).toBeGreaterThan(0);
    expect(res.body.avgAmplitude).toBeGreaterThan(0);
  });
});
