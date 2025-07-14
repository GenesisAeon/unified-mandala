import fs from 'fs';
import YAML from 'yaml';
import { emitSigillinCommit } from './sigillin';

export async function runFractalTask(taskYaml: string) {
  const task = YAML.parse(fs.readFileSync(taskYaml, 'utf8'));
  let currentData = task.input;
  const history: any[] = [];
  for (const step of task.steps) {
    const Plugin = require(step.plugin).default || require(step.plugin);
    const layer = new Plugin(step.plugin, 0, currentData, step.config);
    const metrics = layer.analyze();
    history.push({ plugin: step.plugin, metrics });
    currentData = metrics;
  }
  if (task.doc) await emitSigillinCommit(task, history);
  return history;
}
