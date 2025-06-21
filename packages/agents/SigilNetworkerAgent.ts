import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';

export class SigilNetworkerAgent implements Agent {
  id = 'SigilNetworker';
  layer: 'Math' = 'Math';
  constructor() { withFSM(this); }
  async handle(task: Task): Promise<void> {
    console.log(`🌐 SigilNetworker → Netzwerk für ${task.id}`);
  }
}
