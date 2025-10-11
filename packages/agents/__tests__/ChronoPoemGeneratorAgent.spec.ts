import { describe, it, expect, vi } from 'vitest';
import { ChronoPoemGeneratorAgent } from '../ChronoPoemGeneratorAgent';

vi.spyOn(console, 'log').mockImplementation(() => {});

describe('ChronoPoemGeneratorAgent', () => {
  it('generates poem line from task title', async () => {
    const agent = new ChronoPoemGeneratorAgent();
    await agent.handle({ id: 'T3', description: 'Synchronisiere den Himmel' });
    expect(console.log).toHaveBeenCalledWith(
      '📝 ChronoPoemGeneratorAgent → line="Synchronisiere den Himmel"',
    );
  });
});
