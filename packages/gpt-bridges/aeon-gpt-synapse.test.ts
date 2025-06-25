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

  it('throws after max retries', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('offline'));
    global.fetch = mockFetch as any;
    await expect(
      sendToGPT({ role: GPTRole.AEON, input: 'test' })
    ).rejects.toThrow(/Network request failed/);
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });
});
