import { isAligned, StarAlignment } from './SternausrichtungModul';

test('detects alignment within threshold', () => {
  const a: StarAlignment = { star: 'Sirius', azimuth: 0.5 };
  expect(isAligned(a)).toBe(true);
});
