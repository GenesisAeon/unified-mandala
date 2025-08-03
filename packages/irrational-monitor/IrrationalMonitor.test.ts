import { IrrationalMonitor } from './IrrationalMonitor';

test('detects deviation beyond tolerance', () => {
  const off = IrrationalMonitor.expected('pi') + 1e-4;
  expect(IrrationalMonitor.isDeviation('pi', off, 1e-5)).toBe(true);
});

test('accepts value within tolerance', () => {
  const within = IrrationalMonitor.expected('phi') + 1e-7;
  expect(IrrationalMonitor.isDeviation('phi', within, 1e-5)).toBe(false);
});
