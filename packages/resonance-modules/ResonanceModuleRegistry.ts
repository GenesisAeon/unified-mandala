export interface RegisteredModule {
  id: string;
  process(input: unknown): unknown;
}

export class ResonanceModuleRegistry {
  private modules = new Map<string, RegisteredModule>();

  register(module: RegisteredModule) {
    this.modules.set(module.id, module);
  }

  get(id: string): RegisteredModule | undefined {
    return this.modules.get(id);
  }

  run(id: string, input: unknown) {
    const mod = this.modules.get(id);
    return mod ? mod.process(input) : undefined;
  }
}
