import { describe, it, expect, vi } from 'vitest';
import { AeonMembraneAgent } from '../AeonMembraneAgent';
import { AeonMemory } from '../../core/AeonMemory';
import { AeonKIResonanzAgent } from '../AeonKIResonanzAgent';

vi.spyOn(console, 'log').mockImplementation(() => {});

describe('AeonMembraneAgent', () => {
  it('harmonizes task input', async () => {
    const ki = new AeonKIResonanzAgent();
    const memSpy = vi.spyOn(AeonMemory, 'record');
    const resSpy = vi.spyOn(ki, 'resonate');
    const agent = new AeonMembraneAgent(0, ki);
    await agent.handle({ id: 'm-1', description: 'test 10 20' });
    expect(memSpy).toHaveBeenCalled();
    expect(resSpy).toHaveBeenCalled();
    expect((console.log as any).mock.calls[0][0]).toContain('AeonMembraneAgent');
  });
});
