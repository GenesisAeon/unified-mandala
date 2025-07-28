import { PantheonBoundaryHarmonizer } from './PantheonBoundaryHarmonizer';

test('harmonize returns upper case resolved rule', () => {
  const harmonizer = new PantheonBoundaryHarmonizer();
  expect(harmonizer.harmonize('abc')).toBe('RESOLVED:ABC');
});
