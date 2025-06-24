import fs from 'fs';
import path from 'path';
import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';
import { compile, transpileToTS } from '../aeon-universal';

export class AeonTranspilerAgent implements Agent {
  id = 'AeonTranspiler';
  layer: 'Aeon' = 'Aeon';
  output: string;
  constructor(output = 'aeon-output.ts') {
    this.output = output;
    withFSM(this);
  }

  async handle(task: Task): Promise<void> {
    const result = compile(task.description);
    const code = transpileToTS(result);
    fs.writeFileSync(path.resolve(this.output), code, 'utf-8');
    console.log(`\uD83D\uDEE0 AeonTranspilerAgent \u2192 wrote ${this.output}`);
  }
}
