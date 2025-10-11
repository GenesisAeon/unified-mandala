import fs from 'fs';
import path from 'path';
import { MemoryManager } from './index';

export function ingestArchives(mm: MemoryManager) {
  const base = path.join(__dirname, '..', '..');
  const files = [
    path.join(base, 'docs', 'archive', 'archiv-menschheitsspuren.md'),
    path.join(base, 'docs', 'archive', 'cosmic-event-timeline.md'),
  ];
  files.forEach((file) => {
    if (!fs.existsSync(file)) return;
    const lines = fs
      .readFileSync(file, 'utf8')
      .split('\n')
      .filter((l) => l.startsWith('-'))
      .map((l) => l.replace(/^\-\s*/, '').trim());
    lines.forEach((line) => mm.add('longterm', line));
  });
}
