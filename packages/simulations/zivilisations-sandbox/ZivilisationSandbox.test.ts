import { describe, it, expect } from 'vitest';
import { estimateStability } from './index';

describe('ZivilisationSandbox', () => {
  it('estimates stability via log of blocks', () => {
    expect(estimateStability({name:'pyramid', blocks:1000})).toBeCloseTo(Math.log(1000));
  });
});
