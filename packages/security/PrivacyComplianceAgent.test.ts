import { checkCompliance } from './PrivacyComplianceAgent';

test('validates fields', () => {
  expect(checkCompliance(['a'], ['a','b'])).toBe(true);
  expect(checkCompliance(['c'], ['a'])).toBe(false);
});
