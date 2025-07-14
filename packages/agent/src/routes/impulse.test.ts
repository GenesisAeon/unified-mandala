import request from 'supertest';
import express from 'express';
import impulseRouter from './impulse';

test('POST /impulse/:idx/crep returns ok', async () => {
  const app = express();
  app.use(impulseRouter);
  const res = await request(app).post('/impulse/1/crep');
  expect(res.body.ok).toBe(true);
});
