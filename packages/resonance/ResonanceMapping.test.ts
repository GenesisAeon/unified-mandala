import { ResonanceMapping } from './ResonanceMapping';

describe('ResonanceMapping', () => {
  it('aggregates Fourier amplitudes', () => {
    const rm = new ResonanceMapping();
    const res = rm.map([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
    ]);
    expect(res.length).toBe(4);
    expect(res[0]).toBeGreaterThan(0);
  });
});
