import { TextEncoder } from 'util';
// polyfill for Node versions lacking TextEncoder
global.TextEncoder = TextEncoder;
import request from 'supertest';
import express from 'express';
import healthz from './healthz';

const app = express();
app.use(healthz);

describe('healthz route', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
