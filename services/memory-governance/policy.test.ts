import { shouldCleanup, DefaultPolicy } from './policy';
import { describe, it, expect } from 'vitest';

describe('memory-governance policy', () => {
  it('triggers cleanup when limit exceeded', () => {
    expect(shouldCleanup('daily', 60)).toBe(true);
  });

  it('does not trigger cleanup when below limit', () => {
    expect(shouldCleanup('weekly', 100)).toBe(false);
  });
});
