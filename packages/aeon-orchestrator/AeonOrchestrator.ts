export type AeonEvent = { type: string; payload?: any };

export class AeonOrchestrator {
  private listeners: ((e: AeonEvent) => void)[] = [];

  register(listener: (e: AeonEvent) => void) {
    this.listeners.push(listener);
  }

  unregister(listener: (e: AeonEvent) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  dispatch(event: AeonEvent) {
    for (const l of this.listeners) l(event);
  }
}
