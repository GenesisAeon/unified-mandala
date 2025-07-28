import { describe, it, expect } from 'vitest';
import { isHumanLike } from './TuringTestSuite';

describe('TuringTestSuite', () => {
  it('flags short machine-like answers', () => {
    expect(isHumanLike('yes')).toBe(false);
  });
  it('accepts longer natural text', () => {
    expect(isHumanLike('Hello there, how are you?')).toBe(true);
  });
});
