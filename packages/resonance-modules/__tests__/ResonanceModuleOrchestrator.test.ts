import { describe, it, expect } from 'vitest';
import { ResonanceModuleOrchestrator } from '../ResonanceModuleOrchestrator';

class DummyModule {
  id = 'dummy';
  process(input: unknown) { return input; }
}

describe('ResonanceModuleOrchestrator', () => {
  it('runs all modules', () => {
    const orch = new ResonanceModuleOrchestrator();
    orch.register(new DummyModule());
    expect(orch.runAll('x')).toEqual(['x']);
  });
});
