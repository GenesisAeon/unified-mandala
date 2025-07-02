import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { SimHostOrchestrator } from './SimHostOrchestrator';
import { SimulationModule } from '../universum-simulationen/SimHostCore';

test('orchestrates simulation modules', () => {
  const orchestrator = new SimHostOrchestrator();
  const mod: SimulationModule = { run: () => 'ok' };
  orchestrator.register(mod);
  expect(orchestrator.run()).toEqual(['ok']);
});
