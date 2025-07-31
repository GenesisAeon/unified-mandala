import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { MistralAPI } from './index';

vi.mock('axios');

describe('MistralAPI', () => {
  it('calls API with prompt and returns code', async () => {
    (axios.post as any) = vi.fn().mockResolvedValue({ data: { code: 'console.log("hi")' } });
    const api = new MistralAPI('http://mistral', 'key');
    const res = await api.generate('hi');
    expect(axios.post).toHaveBeenCalled();
    expect(res).toBe('console.log("hi")');
  });
});
