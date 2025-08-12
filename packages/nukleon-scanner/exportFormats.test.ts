import { toCSV, toJSON, toDOT, toMIDI, toAEON } from './exportFormats';

test('toCSV and toJSON', () => {
  const data = { a: 1, b: 2 };
  expect(toCSV(data)).toBe('key,value\na,1\nb,2');
  expect(JSON.parse(toJSON(data))).toEqual(data);
});

test('toDOT', () => {
  const data = { node: 3 };
  const dot = toDOT(data);
  expect(dot).toContain('digraph');
  expect(dot).toContain('"node"');
});

test('toMIDI', () => {
  const midi = toMIDI({ a: 60 });
  expect(midi).toBeInstanceOf(Uint8Array);
  expect(Array.from(midi)).toEqual([60]);
});

test('toAEON', () => {
  const res = toAEON({ a: 1, b: 2 });
  expect(res).toBe('a:1|b:2');
});
