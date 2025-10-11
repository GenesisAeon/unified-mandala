import { describe, expect, it, vi } from 'vitest';

import { askOpenAI, type ChatMessage } from '../src/ask.js';

describe('askOpenAI', () => {
  it('maps chat messages to Responses API payload', async () => {
    const messages: ChatMessage[] = [
      { role: 'system', content: 'Stay friendly.' },
      { role: 'user', content: 'Hallo Aeon!' },
      { role: 'assistant', content: 'Hi there!' },
    ];

    const create = vi.fn(async (payload: Record<string, unknown>) => {
      expect(payload).toMatchObject({
        model: 'gpt-test',
        temperature: 0.2,
        max_output_tokens: 120,
      });

      expect(payload.input).toEqual([
        {
          role: 'system',
          content: [{ type: 'input_text', text: 'Stay friendly.' }],
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: 'Hallo Aeon!' }],
        },
        {
          role: 'assistant',
          content: [{ type: 'output_text', text: 'Hi there!' }],
        },
      ]);

      return {
        model: 'gpt-test',
        output: [
          {
            content: [{ type: 'output_text', text: 'Willkommen zurück!' }],
            finish_reason: 'stop',
          },
        ],
        usage: {
          input_tokens: 12,
          output_tokens: 8,
          total_tokens: 20,
        },
      };
    });

    const fakeClient = {
      responses: {
        create,
      },
    } as const;

    const result = await askOpenAI({
      messages,
      model: 'gpt-test',
      temperature: 0.2,
      max_tokens: 120,
      client: fakeClient as any,
    });

    expect(create).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      text: 'Willkommen zurück!',
      finish_reason: 'stop',
      model: 'gpt-test',
      usage: {
        input_tokens: 12,
        output_tokens: 8,
        total_tokens: 20,
      },
    });
  });
});
