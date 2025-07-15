import { TextEncoder } from 'util';
(global as any).TextEncoder = TextEncoder;
import request from 'supertest';
import { startServer } from './index';

describe('sigil generator service', () => {
  const { server } = startServer(4310);
  afterAll(() => server.close());

  it('returns markdown', async () => {
    const res = await request('http://localhost:4310')
      .post('/sigil/generate')
      .send({ prompt: 'test' });
    expect(res.body.markdown).toContain('test');
  });
});
