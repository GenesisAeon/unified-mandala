import { phiGradientFeedback } from './feedback';

describe('phiGradientFeedback', () => {
  it('scales weights along the phi spiral', () => {
    const res = phiGradientFeedback([1, 1, 1]);
    const PHI = (1 + Math.sqrt(5)) / 2;
    expect(res[0]).toBeCloseTo(1);
    expect(res[1]).toBeCloseTo(PHI);
    expect(res[2]).toBeCloseTo(PHI * PHI);
  });
});
