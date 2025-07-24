import { AeonOrchestrator } from '../src/index';
import { createServer } from 'http';
import { describe, it, expect } from 'vitest';

describe('AeonOrchestrator', () => {
  it('initializes socket server', () => {
    const httpServer = createServer();
    const orchestrator = new AeonOrchestrator(httpServer);
    expect(orchestrator).toBeInstanceOf(AeonOrchestrator);
  });
});
