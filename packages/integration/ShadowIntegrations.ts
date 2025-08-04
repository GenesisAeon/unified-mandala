import { integrateShadow, extractShadow } from './ShadowIntegration';

export class ShadowIntegrations {
  private flows = new Map<string, string>();

  register(name: string, payload: string, key = 42) {
    const encoded = integrateShadow(payload, key);
    this.flows.set(name, encoded);
  }

  unregister(name: string) {
    this.flows.delete(name);
  }

  retrieve(name: string, key = 42): string | undefined {
    const encoded = this.flows.get(name);
    if (!encoded) return undefined;
    return extractShadow(encoded, key);
  }

  list(): string[] {
    return Array.from(this.flows.keys());
  }
}
