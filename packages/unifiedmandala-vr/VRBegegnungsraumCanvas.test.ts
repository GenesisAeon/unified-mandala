import { describe, it, expect } from 'vitest';
import { VRBegegnungsraumCanvasBridge } from './VRBegegnungsraumCanvas';

class DummyListener {
  events: string[] = [];
  onVREvents(events: string[]) {
    this.events.push(...events);
  }
}

describe('VRBegegnungsraumCanvasBridge', () => {
  it('connects and forwards events', async () => {
    const bridge = new VRBegegnungsraumCanvasBridge();
    const listener = new DummyListener();
    await bridge.connect('scene', listener);
    expect(listener.events[0]).toBe('loaded:scene');
  });
});
