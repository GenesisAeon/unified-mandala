// Jest provides describe and it globals in this environment
import { combinedWeight } from './weights';

describe('combinedWeight', () => {
  it('multiplies level with factor', () => {
    expect(combinedWeight(2, 3)).toBe(6);
  });
});
