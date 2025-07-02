import { RealTimePerformanceMonitor } from './RealTimePerformanceMonitor';

test('computes average', () => {
  const m = new RealTimePerformanceMonitor();
  m.record(1); m.record(3);
  expect(m.average()).toBe(2);
});
