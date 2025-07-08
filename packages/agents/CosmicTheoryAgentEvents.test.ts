import { test, expect } from 'vitest';
import { CosmicTheoryEventHub, logTrace } from './CosmicTheoryAgentEvents';

test('emit and receive events', () => {
  const logs: string[] = [];
  CosmicTheoryEventHub.on('trace:log', (payload) => {
    logs.push(payload.message);
  });
  logTrace('hello');
  expect(logs).toContain('hello');
});
