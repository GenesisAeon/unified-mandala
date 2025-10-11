import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';
import { AeonTranspilerAgent } from './AeonTranspilerAgent';
import { AeonPythonTranspilerAgent } from './AeonPythonTranspilerAgent';
import { AeonGoTranspilerAgent } from './AeonGoTranspilerAgent';
import { AeonRustTranspilerAgent } from './AeonRustTranspilerAgent';
import { AeonJsTranspilerAgent } from './AeonJsTranspilerAgent';

export class AeonUniversalCoordinatorAgent implements Agent {
  id = 'AeonUniversalCoordinator';
  layer: 'Aeon' = 'Aeon';
  private tsAgent: AeonTranspilerAgent;
  private pyAgent: AeonPythonTranspilerAgent;
  private goAgent: AeonGoTranspilerAgent;
  private rsAgent: AeonRustTranspilerAgent;
  private jsAgent: AeonJsTranspilerAgent;

  constructor(
    tsOut = 'aeon-output.ts',
    pyOut = 'aeon-output.py',
    goOut = 'aeon-output.go',
    rsOut = 'aeon-output.rs',
    jsOut = 'aeon-output.js',
  ) {
    this.tsAgent = new AeonTranspilerAgent(tsOut);
    this.pyAgent = new AeonPythonTranspilerAgent(pyOut);
    this.goAgent = new AeonGoTranspilerAgent(goOut);
    this.rsAgent = new AeonRustTranspilerAgent(rsOut);
    this.jsAgent = new AeonJsTranspilerAgent(jsOut);
    withFSM(this);
  }

  async handle(task: Task): Promise<void> {
    await this.tsAgent.handle(task);
    await this.pyAgent.handle(task);
    await this.goAgent.handle(task);
    await this.rsAgent.handle(task);
    await this.jsAgent.handle(task);
  }
}
