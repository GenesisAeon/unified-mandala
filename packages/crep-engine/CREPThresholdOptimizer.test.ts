import { optimizeThreshold } from './CREPThresholdOptimizer';

test('moves threshold toward average using learning rate', () => {
  expect(optimizeThreshold([0.8, 0.9], 0.5, 0.5)).toBeCloseTo(0.7, 5);
});

test('clamps threshold within bounds', () => {
  expect(optimizeThreshold([2], 0.9, 0.5)).toBe(1);
  expect(optimizeThreshold([-1], 0.1, 0.5)).toBe(0);
});
