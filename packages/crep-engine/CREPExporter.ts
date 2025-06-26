import fs from 'fs';
import { CREPEntry } from './types';

export function exportCREP(history: CREPEntry[], file: string) {
  fs.writeFileSync(file, JSON.stringify(history, null, 2), 'utf8');
}
