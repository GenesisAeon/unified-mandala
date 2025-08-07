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

test('agents with no thresholds always run', async () => {
  const run = vi.fn();
  const a: CoordinatedAgent = {
    id: 'a',
    run: async () => {
      run();
    },
  };
  const coord = new AgentCoordinator([a]);
  await coord.coordinate(5, 0); // low CREP and arbitrary symbolzeit
  expect(run).toHaveBeenCalled();
});

test('skips agents when individual thresholds not met', async () => {
  const calls: string[] = [];
  const byCrep: CoordinatedAgent = {
    id: 'crep',
    minCrep: 0.7,
    run: async () => {
      calls.push('crep');
    },
  };
  const bySymbol: CoordinatedAgent = {
    id: 'symbol',
    symbolzeitInterval: 3,
    run: async () => {
      calls.push('symbol');
    },
  };
  const coord = new AgentCoordinator([byCrep, bySymbol]);
  await coord.coordinate(2, 0.6); // CREP below 0.7 and symbolzeit not multiple of 3
  expect(calls).toEqual([]);
});

test('agent with both thresholds runs only when both satisfied', async () => {
  const spy = vi.fn();
  const agent: CoordinatedAgent = {
    id: 'a',
    minCrep: 0.5,
    symbolzeitInterval: 2,
    run: async (s, c) => {
      spy(s, c);
    },
  };
  const coord = new AgentCoordinator([agent]);
  await coord.coordinate(2, 0.4); // symbolzeit ok, CREP too low
  await coord.coordinate(3, 0.6); // CREP ok, symbolzeit not divisible by 2
  await coord.coordinate(4, 0.6); // both satisfied
  expect(spy).toHaveBeenCalledTimes(1);
});

test('symbolzeitInterval of 1 always passes when CREP gate satisfied', async () => {
  const spy = vi.fn();
  const agent: CoordinatedAgent = {
    id: 'a',
    minCrep: 0.5,
    symbolzeitInterval: 1,
    run: async (s, c) => {
      spy(s, c);
    },
  };
  const coord = new AgentCoordinator([agent]);
  await coord.coordinate(5, 0.4); // CREP too low
  await coord.coordinate(7, 0.6); // CREP satisfied, interval always passes
  expect(spy).toHaveBeenCalledTimes(1);
});

test('handles negative and zero threshold values', async () => {
  const calls: string[] = [];
  const negMin: CoordinatedAgent = {
    id: 'negMin',
    minCrep: -1,
    run: async () => {
      calls.push('negMin');
    },
  };
  const zeroMin: CoordinatedAgent = {
    id: 'zeroMin',
    minCrep: 0,
    run: async () => {
      calls.push('zeroMin');
    },
  };
  const zeroInterval: CoordinatedAgent = {
    id: 'zeroInterval',
    symbolzeitInterval: 0,
    run: async () => {
      calls.push('zeroInterval');
    },
  };
  const negInterval: CoordinatedAgent = {
    id: 'negInterval',
    symbolzeitInterval: -2,
    run: async () => {
      calls.push('negInterval');
    },
  };
  const coord = new AgentCoordinator([
    negMin,
    zeroMin,
    zeroInterval,
    negInterval,
  ]);
  await coord.coordinate(4, 0.2);
  expect(calls).toContain('negMin');
  expect(calls).toContain('zeroMin');
  expect(calls).not.toContain('zeroInterval');
  expect(calls).not.toContain('negInterval');
});
