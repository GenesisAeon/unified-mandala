import { test, expect } from 'vitest';
import { SimulationOrchestrator } from '../SimulationOrchestrator';
import { SimulationModule } from '../../universum-simulationen/SimHostCore';

test('orchestrates simulation modules', async () => {
  const orchestrator = new SimulationOrchestrator();
  const mod: SimulationModule = { run: () => 'ok' };
  orchestrator.register(mod);
  await expect(orchestrator.runAll()).resolves.toEqual(['ok']);
});
