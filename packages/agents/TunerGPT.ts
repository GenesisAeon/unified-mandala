import fs from 'fs';
import path from 'path';
import { Agent, Task } from '../core/interfaces';

interface TuneLog {
  id: string;
  value: number;
  target: number;
  tuned: number;
}

/**
 * TunerGPT performs a simple numeric tuning towards a target value
 * and persists the tuning history to a JSON file.
 */
export class TunerGPT implements Agent {
  id = 'TunerGPT';
  layer: 'Tuner' = 'Tuner';
  private log: TuneLog[] = [];

  constructor(private output = 'tuner-log.json') {}

  async handle(task: Task & { value?: number; target?: number }): Promise<void> {
    const value = task.value ?? 0;
    const target = task.target ?? value;
    const tuned = value + (target - value) / 2;
    this.log.push({ id: task.id, value, target, tuned });
    fs.writeFileSync(path.resolve(this.output), JSON.stringify(this.log, null, 2));
    console.log(`\uD83C\uDF9A\uFE0F TunerGPT \u2192 tuned ${task.id}`);
  }
}

export default TunerGPT;
