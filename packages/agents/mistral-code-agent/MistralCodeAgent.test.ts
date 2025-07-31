import { describe, it, expect, vi } from 'vitest';
import { MistralCodeAgent } from './index';
import { MistralAPI } from '../mistral-api-agent';

describe('MistralCodeAgent', () => {
  it('delegates code generation to MistralAPI', async () => {
    const api = { generate: vi.fn().mockResolvedValue('code') } as unknown as MistralAPI;
    const agent = new MistralCodeAgent(api);
    const res = await agent.createSnippet('say hi');
    expect(api.generate).toHaveBeenCalledWith('say hi');
    expect(res).toBe('code');
  });
});
