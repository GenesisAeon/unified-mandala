import OpenAIProvider from './OpenAIProvider';

describe('OpenAIProvider', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'test-key';
    delete process.env.USE_RESPONSES_API;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  test('uses responses API when enabled', async () => {
    process.env.USE_RESPONSES_API = '1';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ output: [{ content: [{ text: 'hi' }] }] })
    }) as any;
    const provider = new OpenAIProvider();
    const result = await provider.generate('gpt-4o-mini', 'hi');
    expect(result).toBe('hi');
    expect((global.fetch as any).mock.calls[0][0]).toContain('/responses');
  });

  test('falls back to chat completions on failure', async () => {
    process.env.USE_RESPONSES_API = '1';
    global.fetch = jest
      .fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ choices: [{ message: { content: 'fallback' } }] })
      }) as any;
    const provider = new OpenAIProvider();
    const result = await provider.generate('gpt-4o-mini', 'hi');
    const calls = (global.fetch as any).mock.calls;
    expect(calls[0][0]).toContain('/responses');
    expect(calls[1][0]).toContain('/chat/completions');
    expect(result).toBe('fallback');
  });
});
