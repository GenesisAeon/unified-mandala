import { goldenRatio, fibonacci } from './MassVerhaeltnisModul';

test('computes golden ratio multiplication', () => {
  expect(goldenRatio(1)).toBeCloseTo(1.618, 3);
});

test('computes fibonacci numbers', () => {
  expect(fibonacci(5)).toBe(5);
});
