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
    const results = orch.runAll('x');
    expect(results).toEqual(['x']);
  });

  it('executes plugins', () => {
    const orch = new ResonanceModuleOrchestrator();
    orch.register(new DummyModule());
    let called = 0;
    orch.addPlugin(() => called++);
    orch.runAll('y');
    expect(called).toBe(1);
  });
});
