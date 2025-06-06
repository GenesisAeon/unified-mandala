import fs from 'fs';

export interface FragmentProgress {
  id: string;
  processedAt: string;
}

function loadProgress(file: string): FragmentProgress[] {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8')) as FragmentProgress[];
}

export function isFragmentProcessed(id: string, file: string): boolean {
  const data = loadProgress(file);
  return data.some(p => p.id === id);
}

export function markFragmentProcessed(id: string, file: string) {
  const data = loadProgress(file);
  if (!data.some(p => p.id === id)) {
    data.push({ id, processedAt: new Date().toISOString() });
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  }
}

export function listProcessedFragments(file: string): string[] {
  return loadProgress(file).map(p => p.id);
}
