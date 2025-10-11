export interface ResonanceModule {
  id: string;
  process(input: unknown): unknown;
}

import { EventEmitter } from 'events';

export class ResonanceModuleOrchestrator {
  private modules: ResonanceModule[] = [];
  private plugins: Array<(result: unknown) => void> = [];
  readonly bus = new EventEmitter();

  /**
   * Connect a VR callback to receive module results. The callback can
   * forward data to audio or haptic layers inside the VR room.
   */
  connectVR(handler: (payload: unknown) => void) {
    this.bus.on('result', handler);
  }

  register(module: ResonanceModule) {
    this.modules.push(module);
  }

  addPlugin(fn: (result: unknown) => void) {
    this.plugins.push(fn);
  }

  runAll(input: unknown) {
    const results = this.modules.map((m) => m.process(input));
    for (const r of results) {
      for (const p of this.plugins) p(r);
      this.bus.emit('result', r);
    }
    return results;
  }
}
