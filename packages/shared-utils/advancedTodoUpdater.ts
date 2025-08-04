import fs from 'fs';
import YAML from 'yaml';
import path from 'path';
import { extractTodosFromConversations, extractImplicitTodosFromConversations } from './conversationAnalyzer';

export interface AdvancedTodoEntry {
  commit: string;
  path: string;
  task: string;
  test: string;
}

export interface UpdateOptions {
  includeImplicit?: boolean;
  maxEntries?: number;
}

export function updateAdvancedTodo(
  convFile: string,
  yamlFile: string,
  jsonFile: string,
  options: UpdateOptions = {}
): AdvancedTodoEntry[] {
  const { includeImplicit = false, maxEntries } = options;
  const todos = extractTodosFromConversations(convFile);
  if (includeImplicit) {
    todos.push(...extractImplicitTodosFromConversations(convFile));
  }

  const clean = (t: string) => t.replace(/^[*\-]\s*/, '').replace(/【.*?】/g, '').trim();
  const isValid = (t: string) =>
    /\w{3}/.test(t) &&
    t.split(/\s+/).length >= 3 &&
    t.length <= 120 &&
    !t.startsWith('.') &&
    !t.includes('http') &&
    /[a-zA-Z0-9)]$/.test(t);

  let entries: AdvancedTodoEntry[] = Array.from(new Set(todos.map(clean)))
    .filter(isValid)
    .map((t) => ({
      commit: t,
      path: '',
      task: t,
      test: ''
    }));

  if (typeof maxEntries === 'number') {
    entries = entries.slice(0, maxEntries);
  }

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
