import { callOpenAI, RESPONSES_URL, CHAT_URL } from './openai';

describe('OpenAI provider', () => {
  const originalFetch = global.fetch;
  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'test-key';
  });
  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  test('uses responses API when available', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ output: [{ content: [{ text: 'hi' }] }] })
    }) as any;
    const result = await callOpenAI({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'hi' }] });
    expect(result).toBe('hi');
    expect((global.fetch as any).mock.calls[0][0]).toBe(RESPONSES_URL);
  });

  test('falls back to chat completions when responses fail', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ choices: [{ message: { content: 'fallback' } }] }) }) as any;
    const result = await callOpenAI({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'hi' }] });
    expect(result).toBe('fallback');
    const calls = (global.fetch as any).mock.calls;
    expect(calls[0][0]).toBe(RESPONSES_URL);
    expect(calls[1][0]).toBe(CHAT_URL);
  });
});
