import { GrokAgent } from './index';

test('grok agent instance', () => {
  const agent = new GrokAgent();
  expect(agent).toBeInstanceOf(GrokAgent);
});
