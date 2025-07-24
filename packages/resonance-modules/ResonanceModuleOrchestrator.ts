export interface ResonanceModule {
  id: string;
  process(input: unknown): unknown;
}

import { EventEmitter } from 'events';

export class ResonanceModuleOrchestrator extends EventEmitter {
  private modules: ResonanceModule[] = [];
  private plugins: Array<(result: unknown) => void> = [];

  register(module: ResonanceModule) {
    this.modules.push(module);
  }

  addPlugin(fn: (result: unknown) => void) {
    this.plugins.push(fn);
  }

  runAll(input: unknown) {
    const results = this.modules.map(m => m.process(input));
    for (const r of results) {
      this.emit('result', r);
      for (const p of this.plugins) p(r);
    }
    return results;
  }
}
