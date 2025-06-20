import { contrast, recommendedTextColor } from './AestheticsLayer';

test('contrast calculates difference', () => {
  expect(contrast('#ffffff', '#000000')).toBeGreaterThan(200);
});

test('recommended text color on light bg is black', () => {
  expect(recommendedTextColor('#ffffff')).toBe('#000');
});

test('recommended text color on dark bg is white', () => {
  expect(recommendedTextColor('#000000')).toBe('#fff');
});
