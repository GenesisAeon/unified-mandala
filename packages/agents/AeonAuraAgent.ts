import fs from 'fs';
import path from 'path';
import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';

interface AuraEvent {
  id: string;
  description: string;
  color: string;
  tone: number;
}

export class AeonAuraAgent implements Agent {
  id = 'AeonAura';
  layer: 'Aura' = 'Aura';
  private log: AuraEvent[] = [];
  constructor(private output = 'aeon-aura.json') {
    withFSM(this);
  }

  async handle(task: Task): Promise<void> {
    const aura = this.mapToAura(task.description);
    const event: AuraEvent = { id: task.id, description: task.description, ...aura };
    this.log.push(event);
    fs.writeFileSync(path.resolve(this.output), JSON.stringify(this.log, null, 2));
    console.log(`\uD83C\uDF0C AeonAuraAgent \u2192 logged ${task.id}`);
  }

  private mapToAura(desc: string): { color: string; tone: number } {
    const hash = Array.from(desc).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const hue = hash % 360;
    const tone = 200 + (hash % 400);
    return { color: `hsl(${hue}, 70%, 50%)`, tone };
  }
}
