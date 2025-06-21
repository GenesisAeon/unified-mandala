import { describe, it, expect, vi } from 'vitest';
import { ArchetypeDecoderAgent } from '../ArchetypeDecoderAgent';

vi.spyOn(console, 'log').mockImplementation(() => {});

describe('ArchetypeDecoderAgent', () => {
  it('decodes archetypes from description', async () => {
    const agent = new ArchetypeDecoderAgent();
    await agent.handle({ id: 'T1', description: 'Aktiviere Feuer und Wasser' });
    expect(console.log).toHaveBeenCalledWith('🔥 ArchetypeDecoderAgent → archetypes=["feuer","wasser"]');
  });
});
