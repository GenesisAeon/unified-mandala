import fs from 'fs';
import path from 'path';
import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';
import { compile, transpileToJS } from '../aeon-universal';

export class AeonJsTranspilerAgent implements Agent {
  id = 'AeonJsTranspiler';
  layer: 'Aeon' = 'Aeon';
  output: string;
  constructor(output = 'aeon-output.js') {
    this.output = output;
    withFSM(this);
  }

  async handle(task: Task): Promise<void> {
    const result = compile(task.description);
    const code = transpileToJS(result);
    fs.writeFileSync(path.resolve(this.output), code, 'utf-8');
    console.log(`🔨 AeonJsTranspilerAgent → wrote ${this.output}`);
  }
}
