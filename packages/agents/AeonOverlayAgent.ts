import { Agent, Task } from '../core/interfaces';
import { withFSM } from '../core/fsmMixin';

export class AeonOverlayAgent implements Agent {
  id = 'AeonOverlay';
  layer: 'Aeon' = 'Aeon';
  constructor() {
    withFSM(this);
  }
  async handle(task: Task): Promise<void> {
    console.log(`🌌 AeonOverlay → Overlay für ${task.id}`);
  }
}
