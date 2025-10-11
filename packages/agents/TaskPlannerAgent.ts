import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';

export class TaskPlannerAgent implements Agent {
  id = 'TaskPlanner';
  layer: 'Math' = 'Math';
  constructor() {
    withFSM(this);
  }
  async handle(task: Task): Promise<void> {
    console.log(`📋 TaskPlanner → Planung für ${task.id}`);
  }
}
