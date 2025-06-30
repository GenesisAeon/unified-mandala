/** @jest-environment node */
import { TextEncoder } from 'util';
// polyfill for Node versions lacking TextEncoder
(global as any).TextEncoder = TextEncoder;
import request from 'supertest';
import express from 'express';
import metrics from './metrics';

const app = express();
app.use(metrics);

describe('metrics route', () => {
  it('returns default metrics', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('process_cpu_user_seconds_total');
  });
});
