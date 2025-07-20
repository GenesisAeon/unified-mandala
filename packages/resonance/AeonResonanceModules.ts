export interface AeonModule {
  id: string;
  run(): string;
}

export class AeonResonanceModules {
  modules: AeonModule[] = [];
  register(m: AeonModule) {
    this.modules.push(m);
  }
  runAll(): string[] {
    return this.modules.map(m => m.run());
  }
}

export class AeonMythOS implements AeonModule {
  id = 'AeonMythOS';
  run() {
    return 'mythos-init';
  }
}

export class AeonSigilNet implements AeonModule {
  id = 'AeonSigilNet';
  run() {
    return 'sigilnet-init';
  }
}
