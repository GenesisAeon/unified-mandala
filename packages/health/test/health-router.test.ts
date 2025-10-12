import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { buildHealthRouter } from '../src/index';

describe('buildHealthRouter', () => {
  it('exposes /healthz with 200', async () => {
    const app = express();
    app.use(buildHealthRouter());
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
  });

  it('exposes /readyz with 204 when ready', async () => {
    const app = express();
    app.use(buildHealthRouter({ ready: () => true }));
    const res = await request(app).get('/readyz');
    expect(res.status).toBe(204);
  });

  it('exposes /readyz with 503 when not ready', async () => {
    const app = express();
    app.use(buildHealthRouter({ ready: () => false }));
    const res = await request(app).get('/readyz');
    expect(res.status).toBe(503);
  });

  it('exposes /readyz with 503 on error', async () => {
    const app = express();
    app.use(buildHealthRouter({ ready: () => { throw new Error('x'); } }));
    const res = await request(app).get('/readyz');
    expect(res.status).toBe(503);
  });
});

