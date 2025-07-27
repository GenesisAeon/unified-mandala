import { describe, it, expect } from 'vitest';
import { EventBus } from '../src/eventBus';

describe('EventBus', () => {
  it('emits and receives events in memory', async () => {
    const bus = new EventBus();
    let received: any = null;
    bus.on('test', (payload) => { received = payload; });
    await bus.emit('test', { msg: 'hi' });
    expect(received).toEqual({ msg: 'hi' });
  });
});
