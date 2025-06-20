import { AeonKIResonanzAnalyzer } from './AeonKIResonanzAnalyzer';

test('counts resonance messages', () => {
  const analyzer = new AeonKIResonanzAnalyzer();
  const result = analyzer.analyze(['Resonanz steigt', 'kein match', 'resonanz ton']);
  expect(result.resonanceCount).toBe(2);
});
