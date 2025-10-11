import { describe, it, expect } from 'vitest';
import { MultiverseScenarioPlanner } from './MultiverseScenarioPlanner';

describe('MultiverseScenarioPlanner', () => {
  it('adds scenarios', () => {
    const planner = new MultiverseScenarioPlanner();
    planner.addScenario({ universeId: 'u1', parameters: { gravity: 9.8 } });
    expect(planner.count()).toBe(1);
  });
});
