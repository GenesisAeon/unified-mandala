import { analyzeTrend, classifyTrend } from './CREPTrendAnalyzer';

test('computes linear trend via regression', () => {
  expect(analyzeTrend([1, 2, 3])).toBeCloseTo(1);
});

test('classifies trend direction', () => {
  expect(classifyTrend([1, 2, 3])).toBe('upward');
  expect(classifyTrend([3, 2, 1])).toBe('downward');
  expect(classifyTrend([1, 1, 1.0001])).toBe('stable');
});
