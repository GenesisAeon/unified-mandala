import { soundResonance } from './SoundResonanceModule';

test('generates resonance values', () => {
  const data = soundResonance(2 * Math.PI, 1, 5);
  expect(data.length).toBe(5);
  expect(data[0]).toBeCloseTo(0);
});
