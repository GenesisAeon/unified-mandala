import { test, expect } from 'vitest';
import {
  CosmicTheoryEventHub,
  logTrace,
  enterVR,
  exitVR
} from './CosmicTheoryAgentEvents';

test('emit and receive events', () => {
  const logs: string[] = [];
  CosmicTheoryEventHub.on('trace:log', (payload) => {
    logs.push(payload.message);
  });
  logTrace('hello');
  expect(logs).toContain('hello');
});

test('emit vr enter and exit', () => {
  const events: string[] = [];
  CosmicTheoryEventHub.on('vr:enter', () => events.push('enter'));
  CosmicTheoryEventHub.on('vr:exit', () => events.push('exit'));
  enterVR();
  exitVR();
  expect(events).toEqual(['enter', 'exit']);
});
