import { sendToGPT } from './aeon-gpt-synapse';
import { GPTRole } from './gptRoles';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ response: 'Hallo' })
  })
) as any;

describe('sendToGPT', () => {
  it('sends request and returns response with prefix', async () => {
    const result = await sendToGPT({ role: GPTRole.AEON, input: 'test' });
    expect(fetch).toHaveBeenCalled();
    expect(result).toContain('Hallo');
  });
});
