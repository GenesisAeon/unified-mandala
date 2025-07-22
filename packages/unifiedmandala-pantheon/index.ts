export class UnifiedMandalaPantheon {
  private gateway = new Map<string, string>();

  registerModule(name: string, url: string) {
    this.gateway.set(name, url);
  }

  getModule(name: string): string | undefined {
    return this.gateway.get(name);
  }

  listModules(): Record<string, string> {
    return Object.fromEntries(this.gateway.entries());
  }
}
