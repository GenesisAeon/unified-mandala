import { test, expect } from 'vitest';
import { CosmicTheoryEventHub } from './CosmicTheoryAgentEvents';

test('emit and receive events', () => {
  const logs: string[] = [];
  CosmicTheoryEventHub.on('trace:log', (payload) => {
    logs.push(payload.message);
  });
  CosmicTheoryEventHub.emit('trace:log', { message: 'hello', timestamp: Date.now() });
  expect(logs).toContain('hello');
});
