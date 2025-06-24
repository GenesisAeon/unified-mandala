import fs from 'fs';
import path from 'path';
import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';
import { compile, transpileToRust } from '../aeon-universal';

export class AeonRustTranspilerAgent implements Agent {
  id = 'AeonRustTranspiler';
  layer: 'Aeon' = 'Aeon';
  output: string;
  constructor(output = 'aeon-output.rs') {
    this.output = output;
    withFSM(this);
  }

  async handle(task: Task): Promise<void> {
    const result = compile(task.description);
    const code = transpileToRust(result);
    fs.writeFileSync(path.resolve(this.output), code, 'utf-8');
    console.log(`⚙️ AeonRustTranspilerAgent → wrote ${this.output}`);
  }
}
