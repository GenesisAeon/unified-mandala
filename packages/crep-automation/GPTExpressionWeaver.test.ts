import { weaveExpression } from './GPTExpressionWeaver';

test('weaves expression', () => {
  const result = weaveExpression({
    crep: { C: 1, R: 2, E: 3, P: 4 },
    symbolzeit: 'morgen',
    theme: 'test'
  });
  expect(result).toContain('(morgen) [test]');
});
