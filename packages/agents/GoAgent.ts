import fs from 'fs';
import yaml from 'js-yaml';

export interface GoTask {
  commit: string;
  path: string;
  task: string;
  test?: string;
  status?: string;
}

export class GoAgent {
  jsonTasks: GoTask[] = [];
  yamlTasks: GoTask[] = [];

  constructor(private repoDir: string) {
    this.jsonTasks = this.readJSON('advancedToDo.json');
    this.yamlTasks = this.readYAML('advancedToDo.yaml');
  }

  private readJSON(file: string): GoTask[] {
    try {
      const data = fs.readFileSync(`${this.repoDir}/${file}`, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private readYAML(file: string): GoTask[] {
    try {
      const data = fs.readFileSync(`${this.repoDir}/${file}`, 'utf-8');
      const doc = yaml.load(data);
      return Array.isArray(doc) ? (doc as GoTask[]) : [];
    } catch {
      return [];
    }
  }

  pending(): GoTask[] {
    return this.jsonTasks.filter(t => t.status !== 'done');
  }
}
