import request from 'supertest';
import { createCREPFeedbackAPI } from './CREPFeedbackAPI';
import { CREPManager } from './CREPManager';

const manager = new CREPManager();
const app = createCREPFeedbackAPI(manager);

describe('CREPFeedbackAPI', () => {
  it('accepts new entries and returns averages', async () => {
    await request(app).post('/crep-feedback').send({ C: 1, R: 1, E: 1, P: 1 }).expect(201);

    const res = await request(app).get('/crep-feedback').expect(200);
    expect(res.body.C).toBeGreaterThan(0);
  });
});
