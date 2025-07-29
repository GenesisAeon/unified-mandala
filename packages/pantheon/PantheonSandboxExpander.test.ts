import { describe, it, expect } from 'vitest';
import { PantheonSandboxExpander } from './PantheonSandboxExpander';

describe('PantheonSandboxExpander', () => {
  it('expands sandbox size', () => {
    const expander = new PantheonSandboxExpander();
    expander.addSandbox({ name: 'civ1', size: 100 });
    const result = expander.expand('civ1', 2);
    expect(result.size).toBe(200);
  });
});
