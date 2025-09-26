import express from 'express';
import request from 'supertest';

// Import the live app (it also starts a listener, but supertest can drive the instance)
import { app as liveApp } from '../../apps/api/src/index';

describe('AI Chat Contract - negative cases', () => {
  it('rejects plain text body (missing messages array)', async () => {
    await request(liveApp).post('/api/ai/chat').send({ text: 'hi' }).expect(400);
  });

  it('rejects empty messages array', async () => {
    await request(liveApp).post('/api/ai/chat').send({ messages: [] }).expect(400);
  });
});
