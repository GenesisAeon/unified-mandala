import { describe, it, expect } from 'vitest';
import { BoundaryLawDiscovery, BoundaryRule } from '../BoundaryLawDiscovery';

describe('BoundaryLawDiscovery', () => {
  it('aggregates rules into macro laws', () => {
    const rules: BoundaryRule[] = [
      { id: '1', description: 'speed limit' },
      { id: '2', description: 'speed control' },
      { id: '3', description: 'noise limit', type: 'noise' },
      { id: '4', description: 'noise threshold', type: 'noise' },
    ];
    const b = new BoundaryLawDiscovery();
    expect(b.discover(rules)).toEqual(expect.arrayContaining(['speed-law-2', 'noise-law-2']));
  });
});
