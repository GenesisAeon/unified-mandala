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
});
