import { simulateResonance } from './EmotionalResonanceSimulator';

test('calculates average resonance', () => {
  expect(simulateResonance([1,2,3])).toBe(2);
});
