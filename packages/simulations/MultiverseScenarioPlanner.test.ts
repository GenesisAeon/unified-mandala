import { describe, it, expect } from 'vitest';
import { planNext } from './MultiverseScenarioPlanner';

describe('MultiverseScenarioPlanner', () => {
  it('selects highest probability scenario', () => {
    const best = planNext([{id:'a',probability:0.2},{id:'b',probability:0.5}]);
    expect(best.id).toBe('b');
  });
});
