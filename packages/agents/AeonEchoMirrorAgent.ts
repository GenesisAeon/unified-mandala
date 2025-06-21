import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';

export class AeonEchoMirrorAgent implements Agent {
  id = 'AeonEchoMirror';
  layer: 'Aeon' = 'Aeon';
  constructor() { withFSM(this); }
  async handle(task: Task): Promise<void> {
    console.log(`🪞 AeonEchoMirror → Spiegelung für ${task.id}`);
  }
}
