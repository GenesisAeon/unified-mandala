import { WeightedDispatcher } from './WeightedDispatcher';
import { Agent, Task } from '../core/interfaces';

test('dispatches agents by priority', async () => {
  const calls: string[] = [];
  const agents: Agent[] = [
    { id: 'a', layer: 'L', priority: 1, handle: async (t: Task) => { calls.push('a'); } } as any,
    { id: 'b', layer: 'L', priority: 5, handle: async (t: Task) => { calls.push('b'); } } as any,
  ];
  const d = new WeightedDispatcher(agents);
  await d.dispatch({ id: '1', description: 'x' });
  expect(calls).toEqual(['b', 'a']);
});
