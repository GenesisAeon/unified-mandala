import { describe, it, expect, beforeEach, vi } from 'vitest';

// Provide a lightweight mock for the OpenAI SDK to observe constructor args
vi.mock('openai', () => {
  class MockOpenAI {
    apiKey: string;
    constructor(opts: any) {
      this.apiKey = opts.apiKey;
    }
  }
  return { default: MockOpenAI } as any;
});

describe('AI client env + caching behavior (mocked SDK)', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('createOpenAI uses OPENAI_API_KEY when no explicit key provided', async () => {
    const prev = process.env.OPENAI_API_KEY;
    try {
      process.env.OPENAI_API_KEY = 'unit-env-key';
      const mod = await import('../src/client');
      const client: any = mod.createOpenAI();
      expect(client.apiKey).toBe('unit-env-key');
    } finally {
      if (prev === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = prev;
    }
  });

  it('getOpenAI caches the instance across calls', async () => {
    const prev = process.env.OPENAI_API_KEY;
    try {
      process.env.OPENAI_API_KEY = 'unit-env-key-2';
      const mod = await import('../src/client');
      const a: any = mod.getOpenAI();
      const b: any = mod.getOpenAI();
      expect(a).toBe(b);
      expect(a.apiKey).toBe('unit-env-key-2');
    } finally {
      if (prev === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = prev;
    }
  });
});

