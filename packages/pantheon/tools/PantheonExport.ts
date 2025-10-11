import fs from 'fs';
import path from 'path';

export interface PantheonDataset {
  modules: string[];
}

export function exportPantheonDataset(outputPath: string): PantheonDataset {
  const dir = path.resolve(__dirname, '..');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'));
  const dataset: PantheonDataset = { modules: files };
  fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2));
  return dataset;
}
