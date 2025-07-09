import fs from 'fs';
import YAML from 'yaml';

export interface FractalTask {
  plugin: string;
  input: any;
}

export class FractalTaskRunner {
  runFile(file: string) {
    const tasks = YAML.parse(fs.readFileSync(file, 'utf8')) as FractalTask[];
    return Promise.all(tasks.map(t => this.runTask(t)));
  }

  async runTask(task: FractalTask) {
    const mod = require(task.plugin);
    const fn = mod.default || mod;
    if (typeof fn === 'function') {
      return fn(task.input);
    }
    throw new Error('invalid plugin');
  }
}
