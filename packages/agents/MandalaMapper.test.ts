import { MandalaMapper } from './MandalaMapper';

describe('MandalaMapper', () => {
  it('stores mappings', () => {
    const mapper = new MandalaMapper();
    mapper.add({ id: 'sigil', intensity: 3 });
    expect(mapper.getAll()).toHaveLength(1);
  });
});
