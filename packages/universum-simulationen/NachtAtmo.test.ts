import { generateNachtAtmo } from './NachtAtmo';

test('generateNachtAtmo returns correct amount of stars', () => {
  const stars = generateNachtAtmo(2, 5, 100, 100);
  expect(stars.length).toBe(10);
  expect(stars.every(s => s.x >= 0 && s.x <= 100)).toBe(true);
  expect(stars.every(s => s.layer < 2)).toBe(true);
});
