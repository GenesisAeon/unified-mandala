import { gptSynapse } from './GPTSynapse';

global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ response: 'ok' }) })) as any;

test('calls endpoint and returns response', async () => {
  const res = await gptSynapse('hi', 'http://x');
  expect(res).toBe('ok');
});
