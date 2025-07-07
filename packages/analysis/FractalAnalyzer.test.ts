import { fractalDecompose, computeFractalMetric } from './FractalAnalyzer';

test('decomposes value', () => {
  expect(fractalDecompose(4)).toEqual([2,2]);
});

test('computes metric', () => {
  expect(computeFractalMetric([1,2,3])).toBeCloseTo(2);
});
