import request from 'supertest';
import express from 'express';
import { describe, it, expect } from 'vitest';
import { buildHealthRouter } from '../src/index';

describe('health router', () => {
  it('responds 200 on /healthz', async () => {
    const app = express();
    app.use(buildHealthRouter());
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
  });

  it('responds 204 on /readyz when ready', async () => {
    const app = express();
    app.use(buildHealthRouter({ ready: () => true }));
    const res = await request(app).get('/readyz');
    expect(res.status).toBe(204);
  });

  it('responds 503 on /readyz when not ready', async () => {
    const app = express();
    app.use(buildHealthRouter({ ready: () => false }));
    const res = await request(app).get('/readyz');
    expect(res.status).toBe(503);
  });

  it('responds 503 on /readyz when ready throws', async () => {
    const app = express();
    app.use(buildHealthRouter({ ready: () => { throw new Error('boom'); } }));
    const res = await request(app).get('/readyz');
    expect(res.status).toBe(503);
  });
});

