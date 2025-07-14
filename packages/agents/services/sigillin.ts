import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { AeonSigillinVault } from '../../core/AeonSigillinVault';

export async function emitSigillinCommit(task: any, history: any[]) {
  const record = {
    sigillin_id: task.sigillin_id || 'unknown',
    steps: task.steps.map((s: any) => s.plugin),
    metrics: history,
    config: task,
  };
  const file = path.resolve('sigillin_history.yaml');
  const yaml = YAML.stringify(record);
  if (fs.existsSync(file)) {
    fs.appendFileSync(file, '\n---\n' + yaml);
  } else {
    fs.writeFileSync(file, yaml);
  }
  AeonSigillinVault.record({
    id: record.sigillin_id,
    timestamp: new Date().toISOString(),
    content: 'fractal run',
  });
}
