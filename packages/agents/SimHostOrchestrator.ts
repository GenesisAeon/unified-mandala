import { SimulationModule, SimHostCore } from '../universum-simulationen/SimHostCore';

export class SimHostOrchestrator {
  private core = new SimHostCore();

  register(module: SimulationModule): void {
    this.core.register(module);
  }

  run(): unknown[] {
    return this.core.runAll();
  }
}
