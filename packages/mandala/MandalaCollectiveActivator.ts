export class MandalaCollectiveActivator {
  activate(bus: { publish: (event: string, data: any) => void }): string {
    bus.publish('mandala.collective.started', { timestamp: Date.now() });
    return 'activated';
  }
}
