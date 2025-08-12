export type ExportData = Record<string, number>;

export function toCSV(data: ExportData): string {
  const lines = ['key,value'];
  for (const [key, value] of Object.entries(data)) {
    lines.push(`${key},${value}`);
  }
  return lines.join('\n');
}

export function toJSON(data: ExportData): string {
  return JSON.stringify(data, null, 2);
}

export function toDOT(data: ExportData): string {
  const lines = ['digraph G {'];
  for (const [key, value] of Object.entries(data)) {
    lines.push(`  "${key}" [label="${value}"];`);
  }
  lines.push('}');
  return lines.join('\n');
}

export function toMIDI(data: ExportData): Uint8Array {
  const notes = Object.values(data).map((v) => {
    const n = Math.round(v);
    return Math.max(0, Math.min(127, n));
  });
  return Uint8Array.from(notes);
}

export function toAEON(data: ExportData): string {
  return Object.entries(data)
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
}
