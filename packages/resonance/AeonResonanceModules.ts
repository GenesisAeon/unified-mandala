export interface AeonModule {
  id: string;
  run(): void;
}

export class AeonResonanceModules {
  modules: AeonModule[] = [];
  register(m: AeonModule) {
    this.modules.push(m);
  }
}
