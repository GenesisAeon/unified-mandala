import { buildAgentGraph } from './AgentDependencyGraph';

test('builds adjacency list', () => {
  const g = buildAgentGraph([{ from: 'a', to: 'b' }, { from: 'a', to: 'c' }]);
  expect(g).toEqual({ a: ['b', 'c'] });
});
