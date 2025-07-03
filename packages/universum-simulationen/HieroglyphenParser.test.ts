import { parseGlyphs } from './HieroglyphenParser';

test('splits glyphs by whitespace', () => {
  expect(parseGlyphs('A B C')).toEqual(['A', 'B', 'C']);
});
