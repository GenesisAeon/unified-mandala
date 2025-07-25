import { describe, it, expect, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { exportPantheonDataset } from './PantheonExport';

describe('PantheonExport', () => {
  const outFile = path.join(__dirname, 'pantheonDataset.json');

  afterEach(() => {
    if (fs.existsSync(outFile)) fs.unlinkSync(outFile);
  });

  it('exports module list to JSON', () => {
    exportPantheonDataset(outFile);
    const content = JSON.parse(fs.readFileSync(outFile, 'utf-8'));
    expect(Array.isArray(content.modules)).toBe(true);
    expect(content.modules.length).toBeGreaterThan(0);
  });
});
