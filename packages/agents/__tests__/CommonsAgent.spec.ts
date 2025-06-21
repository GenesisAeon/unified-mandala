import { describe, it, expect } from 'vitest';
import { CommonsAgent } from '../CommonsAgent';

describe('CommonsAgent', () => {
  it('calculates average score', () => {
    const agent = new CommonsAgent();
    const score = agent.score({ openAccess: 1, dataShared: 0.5, openMethods: 0.5 });
    expect(score).toBeCloseTo((1 + 0.5 + 0.5) / 3);
  });
});
