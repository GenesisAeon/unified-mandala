import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';

export class CREPHistorianAgent implements Agent {
  id = 'CREPHistorian';
  layer: 'Greek' = 'Greek';
  constructor() {
    withFSM(this);
  }
  async handle(task: Task): Promise<void> {
    console.log(`📜 CREPHistorian → Historie für ${task.id}`);
  }
}
