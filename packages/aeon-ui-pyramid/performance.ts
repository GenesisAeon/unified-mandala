let sharedCtx: AudioContext | undefined;

export function getAudioContext(): AudioContext | undefined {
  if (typeof AudioContext === 'undefined') return undefined;
  if (!sharedCtx) {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    sharedCtx = new Ctx();
  }
  return sharedCtx;
}

export class LayerCache<T> {
  private map = new Map<string, T>();
  get(id: string): T | undefined {
    return this.map.get(id);
  }
  set(id: string, layer: T): void {
    this.map.set(id, layer);
  }
  clear(): void {
    this.map.clear();
  }
}
