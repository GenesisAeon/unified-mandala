import { TextEncoder } from "util";
(global as any).TextEncoder = TextEncoder;
import { startServer } from './server';
import request from 'supertest';

const PORT = 4010;
const SECRET = 'test-secret';

describe('ghost-shell server', () => {
  const { server } = startServer(PORT, SECRET, false);

  afterAll(() => {
    server.close();
  });

  it('responds to healthz', async () => {
    const res = await request(`http://localhost:${PORT}`).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
