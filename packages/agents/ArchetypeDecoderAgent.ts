import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';

export class ArchetypeDecoderAgent implements Agent {
  id = 'ArchetypeDecoder';
  layer: 'Greek' = 'Greek';
  constructor() {
    withFSM(this);
  }
  async handle(task: Task): Promise<void> {
    const archetypes = task.description.toLowerCase().match(/feuer|wasser|erde|luft/g) || [];
    console.log(`🔥 ArchetypeDecoderAgent → archetypes=${JSON.stringify(archetypes)}`);
  }
}
