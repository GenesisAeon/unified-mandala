import { describe, it, expect } from 'vitest';
import { PantheonBoundaryLawExplorer } from './PantheonBoundaryLawExplorer';

describe('PantheonBoundaryLawExplorer', () => {
  it('counts laws across modules', () => {
    const exp = new PantheonBoundaryLawExplorer();
    const res = exp.explore([
      { module: 'a', law: 'alpha' },
      { module: 'b', law: 'alpha' },
      { module: 'c', law: 'beta' },
    ]);
    expect(res).toEqual({ alpha: 2, beta: 1 });
  });
});
