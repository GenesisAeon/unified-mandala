import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';

export class HookTriggererAgent implements Agent {
  id = 'HookTriggerer';
  layer: 'Aeon' = 'Aeon';
  constructor() { withFSM(this); }
  async handle(task: Task): Promise<void> {
    console.log(`🔔 HookTriggerer → Trigger für ${task.id}`);
  }
}
