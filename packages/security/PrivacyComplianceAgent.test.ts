import { checkCompliance } from './PrivacyComplianceAgent';

test('flags unauthorized fields', () => {
  const result = checkCompliance({ fields: ['email', 'age'], allowed: ['age'] });
  expect(result.compliant).toBe(false);
  expect(result.violations).toEqual(['email']);
});

test('passes when all fields allowed', () => {
  const result = checkCompliance({ fields: ['age'], allowed: ['age', 'email'] });
  expect(result).toEqual({ compliant: true, violations: [] });
});
