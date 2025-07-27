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

  it('emits results on the bus', () => {
    const orch = new ResonanceModuleOrchestrator();
    orch.register(new DummyModule());
    const received: unknown[] = [];
    orch.bus.on('result', r => received.push(r));
    orch.runAll('z');
    expect(received).toEqual(['z']);
  });

  it('connects VR handler to bus', () => {
    const orch = new ResonanceModuleOrchestrator();
    orch.register(new DummyModule());
    const vr: unknown[] = [];
    orch.connectVR(p => vr.push(p));
    orch.runAll('v');
    expect(vr).toEqual(['v']);
  });
});
