import { describe, it, expect } from 'vitest';
import { RLCSOAgent } from '../../../src/modules/ki/RLCSOAgent';

describe('RLCSOAgent', () => {
  it('selects best action according to learned Q', () => {
    const a = new RLCSOAgent();
    const state = 's';
    const actions = ['A', 'B'];
    // Initially equal -> picks first
    expect(a.selectAction(state, actions)).toBe('A');
    // Learn that B is better
    a.update(state, 'B', 1);
    // A gets negative reward
    a.update(state, 'A', -1);
    const chosen = a.selectAction(state, actions);
    expect(chosen).toBe('B');
  });
});
