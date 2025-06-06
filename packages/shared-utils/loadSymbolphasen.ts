import fs from 'fs';
import path from 'path';

export interface Symbolphase {
  phase: string;
  farbe: string;
}

function parseSimpleYaml(content: string): Record<string, Symbolphase> {
  const result: Record<string, Symbolphase> = {};
  const lines = content.split(/\r?\n/);
  let current: Symbolphase | null = null;
  let key: string | null = null;
  for (const line of lines) {
    const keyMatch = line.match(/^(\w+):$/);
    if (keyMatch) {
      key = keyMatch[1];
      current = { phase: '', farbe: '' };
      result[key] = current;
      continue;
    }
    const propMatch = line.match(/^\s+(\w+):\s*"?([^\"]+)"?/);
    if (propMatch && current) {
      (current as any)[propMatch[1]] = propMatch[2];
    }
  }
  return result;
}

export function loadSymbolphasen(): Record<string, Symbolphase> {
  const file = path.resolve(__dirname, '../../config/symbolphasen.yaml');
  const content = fs.readFileSync(file, 'utf8');
  return parseSimpleYaml(content);
}
