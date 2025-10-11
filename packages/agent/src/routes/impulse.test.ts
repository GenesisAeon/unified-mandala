import { TextEncoder, TextDecoder } from 'util';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
import request from 'supertest';
import express from 'express';
import impulseRouter, { impulseMetrics } from './impulse';

test('POST /impulse/:idx/crep returns ok and stores value', async () => {
  const app = express();
  app.use(express.json());
  app.use(impulseRouter);
  const res = await request(app).post('/impulse/1/crep').send({ value: 0.7 });
  expect(res.body.ok).toBe(true);
  expect(impulseMetrics['1']).toContain(0.7);
});
