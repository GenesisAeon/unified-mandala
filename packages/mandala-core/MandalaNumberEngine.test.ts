import { MandalaNumberEngine } from './MandalaNumberEngine';

describe('MandalaNumberEngine', () => {
  it('generates sequence', () => {
    const engine = new MandalaNumberEngine();
    expect(engine.generate(3)).toEqual([1, 2, 3]);
  });
});
