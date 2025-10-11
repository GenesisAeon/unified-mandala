import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';
import { AeonUniversalMembrane } from '../aeon-neural-membrane';
import { AeonMemory } from '../core/AeonMemory';
import { AeonKIResonanzAgent } from './AeonKIResonanzAgent';

export class AeonMembraneAgent implements Agent {
  id = 'AeonMembrane';
  layer: 'Aeon' = 'Aeon';
  private mem: AeonUniversalMembrane;
  private kiAgent?: AeonKIResonanzAgent;

  constructor(reflections = 1, kiAgent?: AeonKIResonanzAgent) {
    this.mem = new AeonUniversalMembrane(undefined, reflections);
    this.kiAgent = kiAgent;
    withFSM(this);
  }

  async handle(task: Task): Promise<void> {
    const nums = (task.description.match(/\d+/g) || []).map((n) => parseInt(n, 10));
    const pairs: [number, number][] = [];
    for (let i = 0; i < nums.length; i += 2) {
      if (nums[i + 1] !== undefined) pairs.push([nums[i], nums[i + 1]]);
    }
    if (pairs.length === 0) {
      pairs.push([task.description.length, task.id.length]);
    }
    const answers = pairs.map(() => 1);
    const res = this.mem.harmonize({
      data: pairs,
      answers,
      text: task.description,
      energyThreshold: 2,
    });
    const sig = res.conv.crepSignature;
    const crepScore = (sig.coherence + sig.resonance + sig.emergence + sig.poetics) / 40;
    AeonMemory.record(task.description, {
      task,
      crepScore,
      energy: res.energy,
      depth: res.depth,
      tone: res.tone,
    });
    if (this.kiAgent) this.kiAgent.resonate(res.tone);
    console.log(`🧠 AeonMembraneAgent → energy ${res.energy.toFixed(2)} depth ${res.depth}`);
  }
}
