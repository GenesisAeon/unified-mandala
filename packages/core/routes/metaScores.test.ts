import { TextEncoder } from 'util';
// polyfill for Node versions lacking TextEncoder
global.TextEncoder = TextEncoder;
import request from 'supertest';
import express from 'express';
import metaScores from './metaScores';

const app = express();
app.use(metaScores);

describe('metaScores route', () => {
  it('returns empty scores', async () => {
    const res = await request(app).get('/api/meta-scores');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ scores: [] });
  });
});
