import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface HistoricalEntry {
  name: string;
  age: string;
  note: string;
}

export function syncHistoricalData(
  sourcePath: string,
  archivePath: string
): void {
  const dataset: HistoricalEntry[] = JSON.parse(
    readFileSync(sourcePath, 'utf8')
  );
  const archiveContent = readFileSync(archivePath, 'utf8');
  const lines = archiveContent.trimEnd().split('\n');
  const markerIndex = lines.findIndex((l) => l.startsWith('## Klimatische'));
  const insertIndex = markerIndex === -1 ? lines.length : markerIndex;

  const newLines: string[] = [];
  for (const entry of dataset) {
    if (archiveContent.includes(entry.name)) {
      continue;
    }
    newLines.push(
      `- **${entry.name}** – ${entry.age} – ${entry.note}.`
    );
  }

  if (newLines.length > 0) {
    lines.splice(insertIndex, 0, ...newLines);
    writeFileSync(archivePath, lines.join('\n') + '\n');
  }
}

if (require.main === module) {
  const source =
    process.argv[2] ||
    join(__dirname, '..', 'docs', 'archive', 'historical-data.json');
  const target =
    process.argv[3] ||
    join(__dirname, '..', 'docs', 'archive', 'archiv-menschheitsspuren.md');
  syncHistoricalData(source, target);
  console.log('Historical dataset synchronized');
}
