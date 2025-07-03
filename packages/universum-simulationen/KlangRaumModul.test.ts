import { resonanceFrequency } from './KlangRaumModul';

test('calculates resonance frequency', () => {
  expect(resonanceFrequency(2)).toBeCloseTo(343 / 4);
});
