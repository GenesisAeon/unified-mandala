import { describe, it, expect, vi } from 'vitest';
import { CREPHistorianAgent } from '../CREPHistorianAgent';

vi.spyOn(console, 'log').mockImplementation(() => {});

describe('CREPHistorianAgent', () => {
  it('logs history', async () => {
    const agent = new CREPHistorianAgent();
    await agent.handle({ id: 'hist-1', description: '...' });
    expect(console.log).toHaveBeenCalledWith('📜 CREPHistorian → Historie für hist-1');
  });
});
