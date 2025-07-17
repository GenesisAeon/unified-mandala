export interface ResonanceModule {
  id: string;
  activate(): void;
}

export class ResonanceModulesScaffold {
  private modules: ResonanceModule[] = [];

  register(module: ResonanceModule) {
    this.modules.push(module);
  }

  getModules(): ResonanceModule[] {
    return this.modules;
  }
}
