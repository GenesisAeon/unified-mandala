export interface SimulationModule {
  run(): unknown;
}

export class SimHostCore {
  private modules: SimulationModule[] = [];

  register(module: SimulationModule): void {
    this.modules.push(module);
  }

  runAll(): unknown[] {
    return this.modules.map((m) => m.run());
  }
}
