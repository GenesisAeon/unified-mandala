import { detectSymbols, generateEcho } from './SymbolEchoLayer';

test('detects hash symbols', () => {
  const symbols = detectSymbols('hello #world #test');
  expect(symbols).toEqual(['world', 'test']);
});

test('generates echo string', () => {
  const echo = generateEcho(['a','b']);
  expect(echo).toBe('a! b!');
});
