import { interpret } from './GPTSymbolInterpreter';

test('interprets known symbols', () => {
  expect(interpret('🔥')).toBe('energy');
  expect(interpret('❓')).toBe('unknown');
});
