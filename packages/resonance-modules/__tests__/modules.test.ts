import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { modules } from '../modules';

describe('resonance microservices', () => {
  it('provides ten modules', () => {
    expect(modules.length).toBe(10);
  });

  it('responds to ping', async () => {
    const res = await request(modules[0]).get('/ping');
    expect(res.body).toEqual({ module: 'module1' });
  });
});
