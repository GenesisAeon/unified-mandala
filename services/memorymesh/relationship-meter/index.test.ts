import { computeMetrics } from './index';

test('computes frequency and depth', () => {
  const metrics = computeMetrics(['a', 'bb']);
  expect(metrics).toEqual({ frequency: 2, depth: 3 });
});
