import { TextEncoder } from "util";
(global as any).TextEncoder = TextEncoder;
import { startServer } from './server';
import request from 'supertest';

const PORT = 4010;
const SECRET = 'test-secret';

describe('ghost-shell server', () => {
  const { server, watcher, scheduler } = startServer(PORT, SECRET, false, false);

  afterAll(() => {
    server.close();
    watcher?.close();
    scheduler?.cancel();
  });

  it('responds to healthz', async () => {
    const res = await request(`http://localhost:${PORT}`).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('responds to readyz', async () => {
    const res = await request(`http://localhost:${PORT}`).get('/readyz');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ready: true });
  });

  it('rejects invalid plugin manifest', async () => {
    const res = await request(`http://localhost:${PORT}`)
      .post('/api/plugin/activate')
      .send({ name: 'mandalaHaiku' });
    expect(res.status).toBe(400);
  });

  it('exposes prometheus metrics', async () => {
    const res = await request(`http://localhost:${PORT}`).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('ghost_connections_total');
  });
});
