import { symbolicRegression } from './SymbolicRegression';

test('returns average formula', () => {
  expect(symbolicRegression([1, 2, 3])).toBe('y = 2.0');
});
