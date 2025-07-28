export interface GatewayEvent {
  type: string;
  payload: any;
}

export class ExtendedResonanceGateway {
  private listeners: ((e: GatewayEvent) => void)[] = [];

  emit(event: GatewayEvent) {
    this.listeners.forEach((l) => l(event));
  }

  on(cb: (e: GatewayEvent) => void) {
    this.listeners.push(cb);
  }
}
