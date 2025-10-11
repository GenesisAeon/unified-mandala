import fs from 'fs';
import path from 'path';

export function syncHistoricalData(datasetPath: string, archivePath: string): void {
  const data = JSON.parse(fs.readFileSync(datasetPath, 'utf-8')) as string[];
  let archive = '';
  try {
    archive = fs.readFileSync(archivePath, 'utf-8');
  } catch {
    // file may not exist
  }
  const existing = new Set(archive.split(/\r?\n/).filter(Boolean));
  const lines: string[] = [];
  for (const entry of data) {
    const line = `- ${entry}`;
    if (!existing.has(line)) {
      lines.push(line);
    }
  }
  if (lines.length) {
    fs.appendFileSync(archivePath, lines.join('\n') + '\n');
  }
}

if (require.main === module) {
  const dataset =
    process.argv[2] || path.join(__dirname, '..', 'docs', 'archive', 'historical-data.json');
  const archive =
    process.argv[3] || path.join(__dirname, '..', 'docs', 'archive', 'archiv-menschheitsspuren.md');
  syncHistoricalData(dataset, archive);
  console.log('Historical dataset synced');
}
