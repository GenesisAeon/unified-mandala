import { describe, it, expect } from 'vitest';
import { EventEmitter } from 'events';
import { AeonCompassionAgent } from './AeonCompassionAgent';

describe('AeonCompassionAgent', () => {
  it('emits sigil-status and logs entry', () => {
    const bus = new EventEmitter();
    let logMsg = '';
    const root = {
      log: (m: string) => {
        logMsg = m;
      },
    };
    const agent = new AeonCompassionAgent(bus);
    let emitted = '';
    bus.on('sigil-status', (s) => (emitted = s));
    agent.process({ type: 'kindness', intensity: 2 }, root);
    expect(emitted).toBe('kindness:2');
    expect(logMsg).toBe('kindness:2');
  });
});
