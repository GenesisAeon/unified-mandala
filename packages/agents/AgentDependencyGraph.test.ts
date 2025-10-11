import { describe, it, expect, vi } from 'vitest';
import { AgentDependencyGraph, buildAgentGraph } from './AgentDependencyGraph';

it('builds adjacency list', () => {
  const g = buildAgentGraph([
    { from: 'a', to: 'b' },
    { from: 'a', to: 'c' },
  ]);
  expect(g).toEqual({ a: ['b', 'c'] });
});

it('emits update events when edges are added', () => {
  const graph = new AgentDependencyGraph();
  const listener = vi.fn();
  graph.on('update', listener);
  graph.addEdge({ from: 'x', to: 'y' });
  expect(graph.getGraph()).toEqual({ x: ['y'] });
  expect(listener).toHaveBeenCalledWith({ x: ['y'] });
});
