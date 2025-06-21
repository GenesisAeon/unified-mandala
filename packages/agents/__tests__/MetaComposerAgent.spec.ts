import { describe, it, expect, vi } from 'vitest';
import { MetaComposerAgent } from '../MetaComposerAgent';

vi.spyOn(console, 'log').mockImplementation(() => {});

describe('MetaComposerAgent', () => {
  it('logs composition', async () => {
    const agent = new MetaComposerAgent();
    await agent.handle({ id: 'meta-1', description: '...' });
    expect(console.log).toHaveBeenCalledWith('🧩 MetaComposer → Komposition für meta-1');
  });
});
