import fs from 'fs';
import YAML from 'yaml';
import path from 'path';
import { extractTodosFromConversations } from './conversationAnalyzer';

export interface AdvancedTodoEntry {
  commit: string;
  path: string;
  task: string;
  test: string;
}

export function updateAdvancedTodo(convFile: string, yamlFile: string, jsonFile: string): AdvancedTodoEntry[] {
  const todos = extractTodosFromConversations(convFile);

  const isValid = (t: string) => /[a-zA-Z0-9]{3}/.test(t);

  const entries: AdvancedTodoEntry[] = Array.from(new Set(todos))
    .filter(isValid)
    .map((t) => ({
      commit: t,
      path: '',
      task: t,
      test: ''
    }));

  const loadYaml = (f: string): AdvancedTodoEntry[] => {
    if (fs.existsSync(f)) {
      const data = YAML.parse(fs.readFileSync(f, 'utf8'));
      return Array.isArray(data) ? data : [];
    }
    return [];
  };
  const loadJson = (f: string): AdvancedTodoEntry[] => {
    if (fs.existsSync(f)) {
      return JSON.parse(fs.readFileSync(f, 'utf8'));
    }
    return [];
  };

  const merge = (existing: AdvancedTodoEntry[], add: AdvancedTodoEntry[]) => {
    const known = new Set(existing.map(e => e.commit));
    for (const e of add) {
      if (!known.has(e.commit)) {
        existing.push(e);
        known.add(e.commit);
      }
    }
    return existing;
  };

  const yamlData = merge(loadYaml(yamlFile), entries);
  const jsonData = merge(loadJson(jsonFile), entries);

  fs.writeFileSync(yamlFile, YAML.stringify(yamlData));
  fs.writeFileSync(jsonFile, JSON.stringify(jsonData, null, 2));
  return entries;
}
