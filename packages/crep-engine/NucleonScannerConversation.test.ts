import { NucleonScanner } from './NucleonScanner';

describe('NucleonScanner conversation import', () => {
  it('parses phi values from transcript', () => {
    const ns = new NucleonScanner();
    const transcript = `line one phi: 0.4\nnext phi=0.9`;
    ns.importFromTranscript(transcript);
    expect(ns.history.length).toBe(2);
    expect(ns.history[0].phi).toBeCloseTo(0.4);
    expect(ns.history[1].phi).toBeCloseTo(0.9);
    expect(ns.averagePhi()).toBeCloseTo(0.65);
  });
});
