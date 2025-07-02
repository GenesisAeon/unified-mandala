import { ErrorReportingSystem } from './ErrorReportingSystem';

test('stores errors', () => {
  const s = new ErrorReportingSystem();
  s.report(new Error('x'));
  expect(s.errors).toEqual(['x']);
});
