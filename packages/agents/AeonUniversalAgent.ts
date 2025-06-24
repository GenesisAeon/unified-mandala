import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';
import { compile } from '../aeon-universal/compiler';
import { AeonMemory } from '../core/AeonMemory';

export class AeonUniversalAgent implements Agent {
  id = 'AeonUniversal';
  layer: 'Aeon' = 'Aeon';
  constructor() {
    withFSM(this);
  }

  async handle(task: Task): Promise<void> {
    const result = compile(task.description);
    result.tasks.forEach(t => {
      AeonMemory.record(t.description, { task: t });
    });
    console.log(`🌀 AeonUniversalAgent → compiled ${result.tasks.length} tasks`);
  }
}
