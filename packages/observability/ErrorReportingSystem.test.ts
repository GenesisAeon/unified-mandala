import { ErrorReportingSystem } from './ErrorReportingSystem';
import { vi } from 'vitest';

test('stores errors with timestamp', () => {
  const s = new ErrorReportingSystem();
  const err = new Error('x');
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  s.report(err);
  const errors = s.getErrors();
  expect(errors).toHaveLength(1);
  expect(errors[0].error).toBe(err);
  expect(typeof errors[0].timestamp).toBe('number');
  spy.mockRestore();
});

test('clears errors', () => {
  const s = new ErrorReportingSystem();
  s.report(new Error('x'));
  s.clear();
  expect(s.getErrors()).toHaveLength(0);
});
