import { describe, it, expect } from 'vitest';
import { BoundaryLawDiscovery } from '../BoundaryLawDiscovery';

describe('BoundaryLawDiscovery', () => {
  it('returns laws', () => {
    const b = new BoundaryLawDiscovery();
    expect(b.discover({})).toEqual(['law1']);
  });
});
