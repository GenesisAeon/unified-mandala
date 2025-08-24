import { SimulationModule } from '../universum-simulationen/SimHostCore';

export class SimulationOrchestrator {
  private modules: SimulationModule[] = [];

  register(module: SimulationModule): void {
    this.modules.push(module);
  }

  async runAll(): Promise<unknown[]> {
    const results: unknown[] = [];
    for (const mod of this.modules) {
      results.push(await Promise.resolve(mod.run()));
    }
    return results;
  }
}
