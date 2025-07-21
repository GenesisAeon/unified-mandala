export class PantheonGateway {
  private routes: Map<string, string> = new Map();

  register(name: string, url: string): void {
    this.routes.set(name, url);
  }

  getRoute(name: string): string | undefined {
    return this.routes.get(name);
  }

  list(): Record<string, string> {
    return Object.fromEntries(this.routes.entries());
  }
}
