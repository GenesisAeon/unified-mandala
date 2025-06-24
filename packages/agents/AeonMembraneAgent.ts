import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';
import { AeonUniversalMembrane } from '../aeon-neural-membrane';

export class AeonMembraneAgent implements Agent {
  id = 'AeonMembrane';
  layer: 'Aeon' = 'Aeon';
  private mem: AeonUniversalMembrane;

  constructor(reflections = 1) {
    this.mem = new AeonUniversalMembrane(reflections);
    withFSM(this);
  }

  async handle(task: Task): Promise<void> {
    const nums = (task.description.match(/\d+/g) || []).map(n => parseInt(n, 10));
    const pairs: [number, number][] = [];
    for (let i = 0; i < nums.length; i += 2) {
      if (nums[i + 1] !== undefined) pairs.push([nums[i], nums[i + 1]]);
    }
    if (pairs.length === 0) {
      pairs.push([task.description.length, task.id.length]);
    }
    const answers = pairs.map(() => 1);
    const res = this.mem.harmonize(pairs, answers, task.description, 2);
    console.log(
      `🧠 AeonMembraneAgent → energy ${res.energy.toFixed(2)} depth ${res.depth}`
    );
  }
}
