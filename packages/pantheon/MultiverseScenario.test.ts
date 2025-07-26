import { describe, it, expect } from 'vitest';
import { listScenarios } from './MultiverseScenario';

describe('listScenarios', () => {
  it('lists default scenario', () => {
    expect(listScenarios()[0].name).toBe('Default');
  });
});
