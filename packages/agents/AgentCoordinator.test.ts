import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { AgentCoordinator, CoordinatedAgent } from './AgentCoordinator';

test('runs agents in priority order when crep high', async () => {
  const calls: string[] = [];
  const a: CoordinatedAgent = { id: 'a', priority: 1, run: async () => { calls.push('a'); } };
  const b: CoordinatedAgent = { id: 'b', priority: 2, run: async () => { calls.push('b'); } };
  const coord = new AgentCoordinator([a, b]);
  await coord.coordinate(10, 0.8);
  expect(calls).toEqual(['b', 'a']);
});
