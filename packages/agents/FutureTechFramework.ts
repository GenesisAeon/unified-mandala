export interface FutureTechModule {
  name: string;
  version: string;
}

export class FutureTechFramework {
  private modules: FutureTechModule[] = [];

  register(module: FutureTechModule): void {
    this.modules.push(module);
  }

  list(): FutureTechModule[] {
    return [...this.modules];
  }
}
