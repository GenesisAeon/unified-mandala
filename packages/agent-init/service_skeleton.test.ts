import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createService } from './service_skeleton';

describe('service_skeleton', () => {
  it('returns ok on /health', async () => {
    const app = createService();
    const res = await request(app).get('/health');
    expect(res.text).toBe('ok');
  });
});
