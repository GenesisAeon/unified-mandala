import { GrokAgent } from './GrokAgent';

test('analyze counts words', () => {
  const agent = new GrokAgent();
  expect(agent.analyze('hello world')).toBe('Grokking 2 words');
});
