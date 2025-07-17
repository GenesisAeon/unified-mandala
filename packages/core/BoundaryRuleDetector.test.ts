import { detectBoundary } from './BoundaryRuleDetector';

describe('detectBoundary', () => {
  it('finds matching rules in text', () => {
    const found = detectBoundary(['foo', 'bar'], 'lorem foo ipsum');
    expect(found).toEqual(['foo']);
  });
});
