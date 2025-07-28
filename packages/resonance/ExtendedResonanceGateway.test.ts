import { describe, it, expect } from 'vitest';
import { ExtendedResonanceGateway, GatewayEvent } from './ExtendedResonanceGateway';

describe('ExtendedResonanceGateway', () => {
  it('emits events to listeners', () => {
    const gateway = new ExtendedResonanceGateway();
    const events: GatewayEvent[] = [];
    gateway.on((e) => events.push(e));
    gateway.emit({ type: 'test', payload: 1 });
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('test');
  });
});
