import fs from 'fs';
import path from 'path';
import { validateSigilFile } from './SigillinValidator';

describe('SigillinValidator CLI', () => {
  const tmpDir = path.join(__dirname, '.tmp');
  beforeAll(() => { fs.mkdirSync(tmpDir, { recursive: true }); });
  afterAll(() => { fs.rmSync(tmpDir, { recursive: true, force: true }); });

  test('valid sigil passes validation', () => {
    const file = path.join(tmpDir, 'valid.json');
    fs.writeFileSync(file, JSON.stringify({
      schema_version: '1.0',
      id: 'sigil-1',
      type: 'poetic-root',
      status: 'draft',
      creator: 'tester',
      created_at: '2025-01-01T00:00:00Z'
    }));
    const result = validateSigilFile(file);
    expect(result.valid).toBe(true);
  });

  test('missing required field fails validation', () => {
    const file = path.join(tmpDir, 'invalid.json');
    fs.writeFileSync(file, JSON.stringify({
      schema_version: '1.0',
      id: 'sigil-1',
      type: 'poetic-root',
      status: 'draft',
      created_at: '2025-01-01T00:00:00Z'
    }));
    const result = validateSigilFile(file);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
  });
});
