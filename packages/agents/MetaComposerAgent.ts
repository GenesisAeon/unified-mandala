import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';

export class MetaComposerAgent implements Agent {
  id = 'MetaComposer';
  layer: 'Aeon' = 'Aeon';
  constructor() { withFSM(this); }
  async handle(task: Task): Promise<void> {
    console.log(`🧩 MetaComposer → Komposition für ${task.id}`);
  }
}
