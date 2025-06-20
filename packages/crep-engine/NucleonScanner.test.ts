import { NucleonScanner } from './NucleonScanner';

describe('NucleonScanner', () => {
  it('calculates average phi', () => {
    const ns = new NucleonScanner();
    ns.logPhi(0.5);
    ns.logPhi(1);
    expect(ns.averagePhi()).toBeCloseTo(0.75);
  });
});
