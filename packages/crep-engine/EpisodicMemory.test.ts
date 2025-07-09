import { EpisodicMemory } from './EpisodicMemory';

describe('EpisodicMemory', () => {
  it('stores entries with timestamp and symbol', () => {
    const mem = new EpisodicMemory();
    mem.add({ C: 1, R: 1, E: 1, P: 1, symbol: 'alpha' });
    const all = mem.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].symbol).toBe('alpha');
    expect(all[0].timestamp instanceof Date).toBe(true);
  });

  it('returns last n entries', () => {
    const mem = new EpisodicMemory();
    for (let i = 0; i < 5; i++) {
      mem.add({ C: i, R: i, E: i, P: i });
    }
    expect(mem.getLast(2).length).toBe(2);
  });
});
