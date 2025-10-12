import request from 'supertest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
let app: any;

describe('API health endpoints', () => {
  beforeEach(async () => {
    (globalThis as any).__UM_TEST_EXPRESS_APP = undefined;
    vi.unmock('express');
    vi.resetModules();
    ({ app } = await import('../../apps/api/src/index'));
  });
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('GET /healthz returns ok', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
