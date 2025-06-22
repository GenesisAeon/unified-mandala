import { AdaptiveThreshold } from './AdaptiveThreshold';

test('computes adaptive threshold', () => {
  const th = new AdaptiveThreshold(3, 1);
  th.push(1);
  th.push(2);
  th.push(3);
  const t = th.getThreshold();
  expect(typeof t).toBe('number');
  expect(t).toBeGreaterThan(0);
});
