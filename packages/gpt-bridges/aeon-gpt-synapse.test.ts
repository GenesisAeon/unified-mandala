import { sendToGPT } from './aeon-gpt-synapse';
import { GPTRole } from './gptRoles';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('sendToGPT', () => {
  it('sends request and returns response with prefix', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ response: 'Hallo' })
      })
    ) as any;
    const result = await sendToGPT({ role: GPTRole.AEON, input: 'test' });
    expect(fetch).toHaveBeenCalled();
    const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
    expect(body.model).toBe('gpt-4.1');
    expect(result).toContain('Hallo');
  });

  it('retries on network failure', async () => {
    const mockFetch = jest
      .fn()
      .mockRejectedValueOnce(new Error('net'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ response: 'Hallo' })
      });
    global.fetch = mockFetch as any;
    const result = await sendToGPT({ role: GPTRole.AEON, input: 'test' });
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result).toContain('Hallo');
  });

  it('falls back to gpt-5 when primary model fails', async () => {
    const mockFetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ response: 'Hallo' })
      });
    global.fetch = mockFetch as any;
    const result = await sendToGPT({ role: GPTRole.AEON, input: 'test' });
    expect(mockFetch).toHaveBeenCalledTimes(4);
    const firstBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    const fourthBody = JSON.parse(mockFetch.mock.calls[3][1].body);
    expect(firstBody.model).toBe('gpt-4.1');
    expect(fourthBody.model).toBe('gpt-5');
    expect(result).toContain('Hallo');
  });

  it('throws after max retries', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('offline'));
    global.fetch = mockFetch as any;
    await expect(
      sendToGPT({ role: GPTRole.AEON, input: 'test' })
    ).rejects.toThrow(/Network request failed/);
    // 3 attempts for each of two models
    expect(mockFetch).toHaveBeenCalledTimes(6);
  });
});
