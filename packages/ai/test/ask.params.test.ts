import { describe, it, expect, vi, beforeEach } from 'vitest';
import { askOpenAI, type ChatMessage } from '../src/ask';

describe('askOpenAI params and response mapping', () => {
  let client: any;
  beforeEach(() => {
    client = { responses: { create: vi.fn() } };
  });

  it('maps temperature and max_tokens and extracts output_text', async () => {
    client.responses.create.mockResolvedValueOnce({
      output_text: 'hello world',
      model: 'gpt-x',
      usage: { total_tokens: 5 },
    });
    const messages: ChatMessage[] = [{ role: 'user', content: 'hi' }];
    const res = await askOpenAI({ messages, temperature: 0.5, max_tokens: 128, client });
    expect(res.text).toBe('hello world');
    expect(res.model).toBe('gpt-x');
    expect(res.usage?.total_tokens).toBe(5);

    const payload = client.responses.create.mock.calls[0][0];
    expect(payload.temperature).toBe(0.5);
    expect(payload.max_output_tokens).toBe(128);
    expect(Array.isArray(payload.input)).toBe(true);
    expect(payload.input[0].content[0].type).toBe('input_text');
  });

  it('extracts text from output[].content and finish_reason', async () => {
    client.responses.create.mockResolvedValueOnce({
      output: [
        { content: [{ text: 'part A' }, { text: 'part B' }], finish_reason: 'stop' },
      ],
      model: 'gpt-y',
    });
    const res = await askOpenAI({
      messages: [
        { role: 'system', content: 's' },
        { role: 'assistant', content: 'prev' },
        { role: 'user', content: 'q' },
      ],
      client,
    });
    expect(res.text).toBe('part A\npart B');
    expect(res.finish_reason).toBe('stop');

    const payload = client.responses.create.mock.calls[0][0];
    const roles = payload.input.map((i: any) => i.content[0].type);
    expect(roles).toEqual(['input_text', 'output_text', 'input_text']);
  });
});

