import { describe, it, expect, beforeEach } from 'vitest';
import { submitVote, getConsentRatio, prioritizeTasks, resetVotes } from './utopie-consent';

describe('utopie-consent', () => {
  beforeEach(() => resetVotes());

  it('calculates consent ratio', () => {
    submitVote('pkgA', true);
    submitVote('pkgA', true);
    submitVote('pkgA', false);
    expect(getConsentRatio('pkgA')).toBeCloseTo(2 / 3);
  });

  it('prioritizes tasks based on consent', () => {
    submitVote('pkgA', true);
    submitVote('pkgA', true);
    submitVote('pkgB', true);
    submitVote('pkgB', false);
    const tasks = [
      { package: 'pkgB', task: 'B' },
      { package: 'pkgA', task: 'A' },
    ];
    const result = prioritizeTasks(tasks);
    expect(result[0].package).toBe('pkgA');
  });
});
