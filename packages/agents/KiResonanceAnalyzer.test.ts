import { KiResonanceAnalyzer } from './KiResonanceAnalyzer';

test('calculates average resonance', () => {
  const analyzer = new KiResonanceAnalyzer();
  const result = analyzer.average([2, 4, 6]);
  expect(result).toBe(4);
});

test('analyze returns stats', () => {
  const analyzer = new KiResonanceAnalyzer();
  const stats = analyzer.analyze([1, 2, 3, 4]);
  expect(stats).toEqual({
    average: 2.5,
    min: 1,
    max: 4,
    variance: 1.25,
  });
});
