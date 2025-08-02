import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import { syncHistoricalData } from './historical-data-sync';

describe('historical-data-sync', () => {
  it('appends new entries to archive', () => {
    const tmp = fs.mkdtempSync(path.join(tmpdir(), 'hist-'));
    const datasetPath = path.join(tmp, 'data.json');
    const archivePath = path.join(tmp, 'archive.md');
    fs.writeFileSync(datasetPath, JSON.stringify(['Entry A', 'Entry B']));
    fs.writeFileSync(archivePath, '- Entry A\n');
    syncHistoricalData(datasetPath, archivePath);
    const content = fs.readFileSync(archivePath, 'utf-8');
    expect(content).toContain('- Entry A');
    expect(content).toContain('- Entry B');
  });
});
