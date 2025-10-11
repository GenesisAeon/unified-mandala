import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';

export class SigillinInterpreterAgent implements Agent {
  id = 'SigillinInterpreter';
  layer: 'Greek' = 'Greek';
  constructor() {
    withFSM(this);
  }
  async handle(task: Task): Promise<void> {
    const matches = [...task.description.matchAll(/sigil\((.*?)\)/gi)];
    const sigils = matches.map((m) => m[1]);
    console.log(`🔮 SigillinInterpreterAgent → sigils=${JSON.stringify(sigils)}`);
  }
}
