import { optimizeThreshold } from './CREPThresholdOptimizer';

test('optimizes towards average', () => {
  expect(optimizeThreshold([2,4], 4)).toBe(3.5);
});
