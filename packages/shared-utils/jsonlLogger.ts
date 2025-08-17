import fs from 'fs';
import path from 'path';

/**
 * Appends a JavaScript object as a JSON line to the given file.
 * The directory is created if it does not yet exist.
 */
export function appendJsonl(filePath: string, obj: any) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.appendFileSync(filePath, JSON.stringify(obj) + '\n', 'utf8');
}

/**
 * Reads a JSONL file and returns an array of parsed objects.
 */
export function readJsonl<T = any>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) return [];
  const lines = fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
  return lines.map(line => JSON.parse(line));
}
