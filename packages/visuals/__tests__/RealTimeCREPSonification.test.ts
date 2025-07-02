import { sonifyCREP } from '../RealTimeCREPSonification';

test('multiplies crep', () => {
  expect(sonifyCREP(2)).toBe(200);
});
