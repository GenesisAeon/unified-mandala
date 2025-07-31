import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

export interface FractalTodoEntry {
  commit: string;
  path: string;
  task: string;
  test: string;
  status?: string;
}

export function extractFractalTodos(sigillinFile: string): string[] {
  if (!fs.existsSync(sigillinFile)) return [];
  const data = YAML.parse(fs.readFileSync(sigillinFile, 'utf8')) as any;
  const list = Array.isArray(data?.fractal_path) ? data.fractal_path : [];
  return list.filter((v: any) => typeof v === 'string');
}

export function updateFractalTodos(
  sigillinFile: string,
  yamlFile = path.resolve(__dirname, '../../advancedToDo.yaml'),
  jsonFile = path.resolve(__dirname, '../../advancedToDo.json')
): FractalTodoEntry[] {
  const todos = extractFractalTodos(sigillinFile);
  const entries: FractalTodoEntry[] = todos.map(t => ({
    commit: t,
    path: '',
    task: t,
    test: '',
    status: 'offen'
  }));
  const loadYaml = (f: string) => (fs.existsSync(f) ? YAML.parse(fs.readFileSync(f, 'utf8')) : []);
  const loadJson = (f: string) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : []);
  const merge = (a: FractalTodoEntry[], b: FractalTodoEntry[]) => {
    const known = new Set(a.map(e => e.commit));
    for (const e of b) {
      if (!known.has(e.commit)) {
        a.push(e);
        known.add(e.commit);
      }
    }
    return a;
  };
  const yamlData = merge(loadYaml(yamlFile), entries);
  const jsonData = merge(loadJson(jsonFile), entries);
  fs.writeFileSync(yamlFile, YAML.stringify(yamlData));
  fs.writeFileSync(jsonFile, JSON.stringify(jsonData, null, 2));
  return entries;
}
