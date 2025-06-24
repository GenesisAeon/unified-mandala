import fs from 'fs';
import path from 'path';
import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';
import { compile, transpileToPython } from '../aeon-universal';

export class AeonPythonTranspilerAgent implements Agent {
  id = 'AeonPythonTranspiler';
  layer: 'Aeon' = 'Aeon';
  output: string;
  constructor(output = 'aeon-output.py') {
    this.output = output;
    withFSM(this);
  }

  async handle(task: Task): Promise<void> {
    const result = compile(task.description);
    const code = transpileToPython(result);
    fs.writeFileSync(path.resolve(this.output), code, 'utf-8');
    console.log(`\uD83D\uDD27 AeonPythonTranspilerAgent \u2192 wrote ${this.output}`);
  }
}
