import { TextEncoder, TextDecoder } from 'util';
// polyfill before importing supertest
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).TextDecoder = TextDecoder;

import router from './index';
import express from 'express';
import request from 'supertest';
const fetch = jest.fn();
(globalThis as any).fetch = fetch;

const app = express();
app.use(express.json());
app.use('/', router);

test('returns 400 without snippet', async () => {
  await request(app).post('/code').expect(400);
});

test('forwards snippet with auth header', async () => {
  process.env.MISTRAL_API_KEY = 'test-key';
  (fetch as unknown as jest.Mock).mockResolvedValue({ json: () => Promise.resolve({ ok: true }) });
  await request(app).post('/code').send({ snippet: 'echo' }).expect(200);
  expect(fetch).toHaveBeenCalledWith(
    'https://api.mistral.ai/v1/code',
    expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        Authorization: 'Bearer test-key',
      }),
    }),
  );
});
