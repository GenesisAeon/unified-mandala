import { checkIntegrity } from './SigillinIntegrityChecker';
import { Sigillin } from './types';

const base: Sigillin = {
  schema_version: '1.0',
  id: 'abc',
  type: 'fallback-anchor',
  status: 'draft',
  creator: 'tester',
  created_at: '2025-01-01',
};

test('accepts valid sigillin objects', () => {
  expect(checkIntegrity(base)).toBe(true);
});

test('rejects missing fields and invalid enums', () => {
  expect(checkIntegrity({ ...base, id: '' })).toBe(false);
  expect(checkIntegrity({ ...base, type: 'unknown' as any })).toBe(false);
  expect(checkIntegrity(undefined)).toBe(false);
});
