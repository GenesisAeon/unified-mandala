import { simulateResonance } from './EmotionalResonanceSimulator';

test('calculates average resonance and positive state', () => {
  const result = simulateResonance([0.6, 0.8, 1]);
  expect(result.average).toBeCloseTo(0.8);
  expect(result.state).toBe('positive');
});

test('detects negative resonance', () => {
  const result = simulateResonance([-0.6, -0.8]);
  expect(result.state).toBe('negative');
});
