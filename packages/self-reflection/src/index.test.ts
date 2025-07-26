import { SelfReflectionAgent } from './index';

test('records and reflects messages', () => {
  const agent = new SelfReflectionAgent();
  agent.record('hello');
  agent.record('world');
  expect(agent.reflect()).toBe('hello\nworld');
  const info = agent.summary();
  expect(info.entries).toBe(2);
  expect(info.lastEntry).toBe('world');
});
