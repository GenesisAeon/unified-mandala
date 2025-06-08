import fs from 'fs';
import path from 'path';
import { validateSigillin } from './SigillinValidator';

const validSigil = {
  schema_version: '1.0',
  id: 'test:001',
  type: 'fallback-anchor',
  status: 'draft',
  creator: 'test',
  created_at: '2024-01-01T00:00:00Z',
};

const file = path.join(__dirname, 'valid.sigil.json');

beforeEach(() => {
  fs.writeFileSync(file, JSON.stringify(validSigil, null, 2));
});

afterEach(() => {
  fs.unlinkSync(file);
});

test('validates a correct sigillin file', () => {
  const res = validateSigillin(file);
  expect(res.valid).toBe(true);
});

test('returns errors for invalid file', () => {
  const invalidFile = path.join(__dirname, 'invalid.sigil.json');
  fs.writeFileSync(invalidFile, JSON.stringify({}));
  const res = validateSigillin(invalidFile);
  fs.unlinkSync(invalidFile);
  expect(res.valid).toBe(false);
  expect(res.errors).toBeTruthy();
});
