import { AeonMemory } from '../core/AeonMemory';

export class ReplayController {
  constructor(private intervalMs = 5000) {}
  public start() {
    setInterval(() => {
      const entry = AeonMemory.all()[0];
      if (entry) console.log(`🔁 Replaying ${entry.task?.id}`);
    }, this.intervalMs);
  }
}
