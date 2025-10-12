import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createOpenAI, getOpenAI } from '../src/client';

describe('AI client', () => {
  const prev = process.env.OPENAI_API_KEY;
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('throws when OPENAI_API_KEY is missing', () => {
    delete process.env.OPENAI_API_KEY;
    expect(() => createOpenAI()).toThrow(/OPENAI_API_KEY/);
  });

  it('uses provided apiKey without env', () => {
    const client = createOpenAI('test-key');
    expect(client).toBeTruthy();
  });

  it('caches getOpenAI instance', () => {
    process.env.OPENAI_API_KEY = prev || 'dummy-key';
    const a = getOpenAI();
    const b = getOpenAI();
    expect(a).toBe(b);
  });
});

