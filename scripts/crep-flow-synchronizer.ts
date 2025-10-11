import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

export interface CREPData {
  [key: string]: any;
}

export function syncCREP(sourceDir: string, targetDir: string) {
  const sourcePath = path.join(sourceDir, 'crep.json');
  const targetPath = path.join(targetDir, 'crep.json');
  if (!existsSync(sourcePath)) {
    throw new Error(`Source file not found: ${sourcePath}`);
  }
  const sourceData: CREPData = JSON.parse(readFileSync(sourcePath, 'utf8'));
  let targetData: CREPData = {};
  if (existsSync(targetPath)) {
    targetData = JSON.parse(readFileSync(targetPath, 'utf8'));
  }
  const merged = { ...targetData, ...sourceData };
  writeFileSync(targetPath, JSON.stringify(merged, null, 2));
}

if (require.main === module) {
  const [source, target] = process.argv.slice(2);
  if (!source || !target) {
    console.error('Usage: ts-node crep-flow-synchronizer.ts <sourceDir> <targetDir>');
    process.exit(1);
  }
  syncCREP(source, target);
}
