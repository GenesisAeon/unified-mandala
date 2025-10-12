import { describe, it, expect, vi } from 'vitest';
import { askOpenAI, type ChatMessage } from '../src/ask.js';

describe('askOpenAI edge cases', () => {
  it('prefers output_text and trims', async () => {
    const messages: ChatMessage[] = [{ role: 'user', content: 'hi' }];
    const create = vi.fn(async () => ({
      model: 'gpt-x',
      output_text: '  Hello  ',
      usage: { total_tokens: 1 },
    }));
    const client = { responses: { create } } as any;
    const res = await askOpenAI({ messages, client });
    expect(res.text).toBe('Hello');
    expect(res.finish_reason).toBeUndefined();
  });

  it('returns empty text when no outputs present', async () => {
    const messages: ChatMessage[] = [{ role: 'user', content: 'hi' }];
    const create = vi.fn(async () => ({ model: 'gpt-x' }));
    const client = { responses: { create } } as any;
    const res = await askOpenAI({ messages, client });
    expect(res.text).toBe('');
    expect(res.finish_reason).toBeUndefined();
  });
});

