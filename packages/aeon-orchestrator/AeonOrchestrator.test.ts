import { describe, it, expect } from 'vitest';
import { AeonOrchestrator, AeonEvent } from './AeonOrchestrator';

describe('AeonOrchestrator', () => {
  it('dispatches events to registered listeners', () => {
    const orch = new AeonOrchestrator();
    const received: AeonEvent[] = [];
    const listener = (e: AeonEvent) => received.push(e);
    orch.register(listener);
    orch.dispatch({ type: 'ping' });
    expect(received).toEqual([{ type: 'ping' }]);
    orch.unregister(listener);
    orch.dispatch({ type: 'pong' });
    expect(received).toEqual([{ type: 'ping' }]);
  });
});
