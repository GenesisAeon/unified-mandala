import { KiResonanceAnalyzer } from './KiResonanceAnalyzer';

test('calculates average resonance', () => {
  const analyzer = new KiResonanceAnalyzer();
  const result = analyzer.average([2, 4, 6]);
  expect(result).toBe(4);
});
