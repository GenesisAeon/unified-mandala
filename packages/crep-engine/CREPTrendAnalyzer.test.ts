import { analyzeTrend } from './CREPTrendAnalyzer';

test('computes linear trend', () => {
  expect(analyzeTrend([1,2,3])).toBe(1);
});
