import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';

export class YAMLNavigatorAgent implements Agent {
  id = 'YAMLNavigator';
  layer: 'Greek' = 'Greek';
  constructor() { withFSM(this); }
  async handle(task: Task): Promise<void> {
    console.log(`🧭 YAMLNavigator → Navigation durch ${task.id}`);
  }
}
