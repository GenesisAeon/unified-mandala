import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { analyzeRepo } from '../../shared-utils/selfAnalyzer';

export interface TodoEntry {
  commit: string;
  path: string;
  task: string;
  test: string;
}

function append(entries: TodoEntry[], yamlFile: string, jsonFile: string) {
  const loadYaml = (f: string) => (fs.existsSync(f) ? YAML.parse(fs.readFileSync(f, 'utf8')) : []);
  const loadJson = (f: string) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : []);
  const merge = (existing: TodoEntry[], add: TodoEntry[]) => {
    const known = new Set(existing.map((e) => e.commit));
    for (const e of add) {
      if (!known.has(e.commit)) {
        existing.push(e);
        known.add(e.commit);
      }
    }
    return existing;
  };
  const y = merge(loadYaml(yamlFile), entries);
  const j = merge(loadJson(jsonFile), entries);
  fs.writeFileSync(yamlFile, YAML.stringify(y));
  fs.writeFileSync(jsonFile, JSON.stringify(j, null, 2));
}

export function generateAdvancedTodos(
  yamlFile = path.resolve(__dirname, '../../../advancedToDo.yaml'),
  jsonFile = path.resolve(__dirname, '../../../advancedToDo.json'),
): TodoEntry[] {
  const stats = analyzeRepo(path.resolve(__dirname, '../../..'));
  const entries = stats.packages.map((pkg) => ({
    commit: `Add tests for ${pkg}`,
    path: `packages/${pkg}`,
    task: `Ensure unit tests exist for ${pkg}`,
    test: `packages/${pkg}/*.test.ts`,
  }));
  append(entries, yamlFile, jsonFile);
  return entries;
}
