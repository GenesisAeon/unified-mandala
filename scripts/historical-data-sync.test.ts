import { syncHistoricalData } from './historical-data-sync';
import { mkdtempSync, copyFileSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { describe, it, expect } from 'vitest';

const datasetPath = join(__dirname, '..', 'docs', 'archive', 'historical-data.json');
const archiveSource = join(
  __dirname,
  '..',
  'docs',
  'archive',
  'archiv-menschheitsspuren.md'
);

describe('historical-data-sync', () => {
  it('appends new dataset entries to archive', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'archive-'));
    const target = join(tempDir, 'archiv.md');
    copyFileSync(archiveSource, target);
    syncHistoricalData(datasetPath, target);
    const content = readFileSync(target, 'utf8');
    expect(content).toContain('Çatalhöyük');
    expect(content).toContain('Monte Verde');
  });
});
