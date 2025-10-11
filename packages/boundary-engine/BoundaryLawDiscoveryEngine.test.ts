import { describe, it, expect } from 'vitest';
import { BoundaryLawDiscoveryEngine } from './BoundaryLawDiscoveryEngine';

describe('BoundaryLawDiscoveryEngine', () => {
  it('discovers laws from rules', () => {
    const engine = new BoundaryLawDiscoveryEngine();
    const rules = [
      { id: 'r1', description: 'alpha rule' },
      { id: 'r2', description: 'alpha rule' },
    ];
    expect(engine.analyze(rules)).toContain('alpha-law-2');
  });
});
