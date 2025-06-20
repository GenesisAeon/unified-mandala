import { compileRitual } from './RitualCompiler';

test('compileRitual joins steps', () => {
  expect(compileRitual(['a', 'b', 'c'])).toBe('a -> b -> c');
});
