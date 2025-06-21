import { describe, it, expect, vi } from 'vitest';
import { CodexSynchronizerAgent } from '../CodexSynchronizerAgent';

vi.spyOn(console, 'log').mockImplementation(() => {});

describe('CodexSynchronizerAgent', () => {
  it('logs sync action', async () => {
    const agent = new CodexSynchronizerAgent();
    await agent.handle({ id: 'codex-1', description: '...' });
    expect(console.log).toHaveBeenCalledWith('🔄 CodexSynchronizer → Sync für codex-1');
  });
});
