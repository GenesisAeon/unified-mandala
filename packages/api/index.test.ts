import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { createServer } from './index';

let server: any;
let request: any;

beforeAll(async () => {
  const app = await createServer();
  server = app.listen();
  request = supertest(server);
});

afterAll(() => {
  server.close();
});

describe('API endpoints', () => {
  it('returns metrics data', async () => {
    const res = await request.get('/metrics');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('activeUsers');
  });

  it('returns gamification data', async () => {
    const res = await request.get('/gamification');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('badges');
  });
});
