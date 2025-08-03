import fs from 'fs';
import path from 'path';
import { generateDepthSigil } from './depth-sigil-generator';

describe('generateDepthSigil', () => {
  const tempDir = path.join('docs', 'sigils');
  it('creates a sigillin file with depth metadata', () => {
    const file = generateDepthSigil(42, tempDir);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    expect(data.id).toBe('depth-42');
    expect(data.depth).toBe(42);
    fs.unlinkSync(file);
  });
});
