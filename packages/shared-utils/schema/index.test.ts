import fs from 'fs';
import path from 'path';
import { validateFile } from './index';

const schemaPath = path.join(__dirname, '../../genesis-sigillin-core/schemas/sigillin.schema.json');
const tmp = path.join(__dirname, 'test.sigil.json');

beforeAll(() => {
  const obj = {
    schema_version: '1.0',
    id: 'schema:test',
    type: 'fallback-anchor',
    status: 'draft',
    creator: 'tester',
    created_at: '2024-01-01T00:00:00Z',
    metadata: { foo: 'bar' },
    consent: 'granted'
  };
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2));
});

afterAll(() => {
  fs.unlinkSync(tmp);
});

test('validates file with metadata and consent', () => {
  const res = validateFile(tmp, schemaPath);
  expect(res.valid).toBe(true);
});
