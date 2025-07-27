export class PhanteonIntegration {
  private modules: string[] = [];

  register(module: string) {
    this.modules.push(module);
  }

  list() {
    return this.modules.slice();
  }
}
