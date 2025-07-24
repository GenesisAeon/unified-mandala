export class PantheonMemorySync {
  private store: Record<string, unknown> = {};

  set(key: string, value: unknown) {
    this.store[key] = value;
  }

  get(key: string) {
    return this.store[key];
  }

  snapshot() {
    return JSON.parse(JSON.stringify(this.store));
  }
}
