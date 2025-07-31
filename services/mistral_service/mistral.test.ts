import router from './index';
import express from 'express';
import request from 'supertest';

const app = express();
app.use(express.json());
app.use('/', router);

test('returns 400 without snippet', async () => {
  await request(app).post('/code').expect(400);
});
