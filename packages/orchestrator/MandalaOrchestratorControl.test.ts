import { describe, it, expect, vi } from 'vitest';
import { MandalaOrchestratorControl } from './MandalaOrchestratorControl';

describe('MandalaOrchestratorControl', () => {
  it('runs all services', () => {
    const service = { run: vi.fn() };
    const ctrl = new MandalaOrchestratorControl([service]);
    ctrl.startAll();
    expect(service.run).toHaveBeenCalled();
  });
});
