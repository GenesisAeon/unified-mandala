export interface ResonanceModule {
  id: string;
  process(input: unknown): unknown;
}

export class ResonanceModuleOrchestrator {
  private modules: ResonanceModule[] = [];

  register(module: ResonanceModule) {
    this.modules.push(module);
  }

  runAll(input: unknown) {
    return this.modules.map(m => m.process(input));
  }
}
