import { SelfReflectionAgent } from './index';

test('records and reflects messages', () => {
  const agent = new SelfReflectionAgent();
  agent.record('hello');
  agent.record('world');
  expect(agent.reflect()).toBe('hello\nworld');
});
