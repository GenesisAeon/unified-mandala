import { describe, it, expect } from 'vitest';
import { generatePantheonManifest } from '../generate_pantheon_manifest';
import fs from 'fs';
import path from 'path';

describe('generatePantheonManifest', () => {
  it('writes manifest file', () => {
    const file = generatePantheonManifest(['a', 'b']);
    const content = JSON.parse(fs.readFileSync(file, 'utf8'));
    expect(content.pantheon).toEqual(['a', 'b']);
    fs.unlinkSync(file);
  });
});
