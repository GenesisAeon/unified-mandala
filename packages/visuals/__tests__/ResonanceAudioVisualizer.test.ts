import { toFrequency } from '../ResonanceAudioVisualizer';

test('maps value to frequency', () => {
  expect(toFrequency(2)).toBe(880);
});
