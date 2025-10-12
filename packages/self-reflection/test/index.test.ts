import { describe, it, expect } from 'vitest';
import { SelfReflectionAgent } from '../src/index';

describe('SelfReflectionAgent', () => {
  it('records, reflects, summarizes, clears', () => {
    const a = new SelfReflectionAgent();
    a.record('first');
    a.record('second');
    expect(a.reflect()).toBe('first\nsecond');
    expect(a.summary()).toMatchObject({ entries: 2, lastEntry: 'second' });
    a.clear();
    expect(a.summary()).toMatchObject({ entries: 0, lastEntry: null });
  });
});

