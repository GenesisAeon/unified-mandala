import { detectBoundary } from './BoundaryRuleDetector';

describe('detectBoundary', () => {
  it('finds matching rules in text', () => {
    const found = detectBoundary(['foo', /ipsum/], 'lorem foo ipsum ipsum');
    expect(found).toEqual([
      { rule: 'foo', occurrences: 1 },
      { rule: 'ipsum', occurrences: 2 },
    ]);
  });
});
