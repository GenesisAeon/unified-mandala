import {
  toFrequency,
  toColor,
  mapResonance,
} from '../ResonanceAudioVisualizer';

test('maps value to frequency', () => {
  expect(toFrequency(2)).toBe(880);
});

test('maps value to color', () => {
  expect(toColor(0.5)).toBe('hsl(180, 100%, 50%)');
});

test('maps array to audio-visual samples', () => {
  expect(mapResonance([0.5])).toEqual([
    { frequency: 220, color: 'hsl(180, 100%, 50%)' },
  ]);
});
