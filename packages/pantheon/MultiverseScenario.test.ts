import { describe, it, expect } from 'vitest';
import { listScenarios } from './MultiverseScenario';

describe('listScenarios', () => {
  it('lists multiple scenarios', () => {
    const scenarios = listScenarios();
    expect(scenarios.length).toBeGreaterThan(1);
    expect(scenarios[0].name).toBe('Default');
  });
});
