import { generateFractalSigil } from '../FractalSigilGenerator';

test('generates SVG polyline for formula', () => {
  const svg = generateFractalSigil('abc');
  expect(svg).toContain('<polyline');
  expect(svg).toContain('svg');
});
