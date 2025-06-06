export class SigillinActivationManager {
  private active = new Set<string>();

  activate(id: string) {
    this.active.add(id);
  }

  deactivate(id: string) {
    this.active.delete(id);
  }

  isActive(id: string) {
    return this.active.has(id);
  }

  listActive() {
    return Array.from(this.active);
  }
}
