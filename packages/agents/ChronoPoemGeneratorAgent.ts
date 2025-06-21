import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';

export class ChronoPoemGeneratorAgent implements Agent {
  id = 'ChronoPoemGenerator';
  layer: 'Greek' = 'Greek';
  constructor() {
    withFSM(this);
  }
  async handle(task: Task): Promise<void> {
    console.log(`📝 ChronoPoemGeneratorAgent → line="${task.description}"`);
  }
}
