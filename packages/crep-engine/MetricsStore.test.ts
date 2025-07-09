import { MetricsStore } from './MetricsStore';

test('computes average', () => {
  const ms = new MetricsStore();
  ms.add(1); ms.add(3);
  expect(ms.average()).toBe(2);
});
