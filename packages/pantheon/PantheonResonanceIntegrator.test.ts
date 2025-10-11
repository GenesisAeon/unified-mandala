import { PantheonResonanceIntegrator } from './PantheonResonanceIntegrator';

describe('PantheonResonanceIntegrator', () => {
  it('averages values', () => {
    const integ = new PantheonResonanceIntegrator();
    expect(integ.integrate([1, 2, 3])).toBe(2);
  });
});
