import { simulatePulse } from './UniversePulseSimulator';

test('simulatePulse returns array of numbers', () => {
  const res = simulatePulse(0, 3);
  expect(res.length).toBe(3);
  expect(typeof res[0]).toBe('number');
});
