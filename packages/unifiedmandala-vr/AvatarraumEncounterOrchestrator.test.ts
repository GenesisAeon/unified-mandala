import { describe, it, expect } from 'vitest';
import { AvatarraumEncounterOrchestrator } from './AvatarraumEncounterOrchestrator';

describe('AvatarraumEncounterOrchestrator', () => {
  it('tracks participants', () => {
    const orch = new AvatarraumEncounterOrchestrator();
    orch.join('a');
    orch.join('b');
    expect(orch.count()).toBe(2);
  });
});
