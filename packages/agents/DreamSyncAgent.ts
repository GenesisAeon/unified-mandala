import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';

export class DreamSyncAgent implements Agent {
  id = 'DreamSync';
  layer: 'Aeon' = 'Aeon';
  constructor() {
    withFSM(this);
  }
  async handle(task: Task): Promise<void> {
    console.log(`🌙 DreamSync → Sync für ${task.id}`);
  }
}
