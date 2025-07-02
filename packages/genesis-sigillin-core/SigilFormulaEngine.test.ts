import { extractKeywords } from './SigilFormulaEngine';

test('extracts keywords from formula', () => {
  const res = extractKeywords('Im Zentrum des Netzes ruht ein Knoten.');
  expect(res).toContain('Zentrum');
});
