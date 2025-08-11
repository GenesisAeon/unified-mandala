import { TextEncoder, TextDecoder } from 'util';
// polyfill for jest/supertest
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).TextDecoder = TextDecoder;

import router from './chat-proxy';
import express from 'express';
import request from 'supertest';
import fetch from 'node-fetch';

jest.mock('node-fetch', () => jest.fn());

const app = express();
app.use(express.json());
app.use('/', router);

test('returns 400 without message', async () => {
  await request(app).post('/api/chat').expect(400);
});

test('forwards message to configured service', async () => {
  (fetch as unknown as jest.Mock).mockResolvedValue({ json: () => Promise.resolve({ ok: true }) });
  await request(app).post('/api/chat').send({ serviceId: 'gpt4all', message: 'hi' }).expect(200);
  expect(fetch).toHaveBeenCalledWith(
    'http://gpt4all:8080/api/chat',
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ message: 'hi' })
    })
  );
});
