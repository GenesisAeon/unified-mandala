import { TextEncoder, TextDecoder } from 'util';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

import express from 'express';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

import router from './configure-services';

const app = express();
app.use(express.json());
app.use('/', router);

const outFile = path.resolve(__dirname, '../user-config/services_selected.yaml');

beforeEach(() => {
  if (fs.existsSync(outFile)) fs.unlinkSync(outFile);
});

test('lists available services', async () => {
  const res = await request(app).get('/api/services').expect(200);
  expect(Array.isArray(res.body.services)).toBe(true);
});

test('saves selected services', async () => {
  await request(app)
    .post('/api/services')
    .send({ selected: ['gpt4all'] })
    .expect(200);
  const saved = yaml.load(fs.readFileSync(outFile, 'utf8')) as any;
  expect(saved.selected).toEqual(['gpt4all']);
});
