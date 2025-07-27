export interface ResonanceModule {
  id: string;
  process(input: unknown): unknown;
}

import { EventEmitter } from 'events';
import { VRHapticFeedbackSystem } from '../unifiedmandala-vr/VRHapticFeedbackSystem';

export class ResonanceModuleOrchestrator {
  private modules: ResonanceModule[] = [];
  private plugins: Array<(result: unknown) => void> = [];
  readonly bus = new EventEmitter();
  private vr?: VRHapticFeedbackSystem;

  register(module: ResonanceModule) {
    this.modules.push(module);
  }

  connectVR(system: VRHapticFeedbackSystem) {
    this.vr = system;
  }

  addPlugin(fn: (result: unknown) => void) {
    this.plugins.push(fn);
  }

  runAll(input: unknown) {
    const results = this.modules.map(m => m.process(input));
    for (const r of results) {
      for (const p of this.plugins) p(r);
      if (this.vr && typeof r === 'number') {
        const intensity = Math.min(1, Math.abs(r as number));
        this.vr.trigger(intensity);
      }
      this.bus.emit('result', r);
    }
    return results;
  }
}
