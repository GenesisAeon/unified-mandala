import { analyzeRepo } from './selfAnalyzer';

describe('selfAnalyzer', () => {
  it('detects packages and docs', () => {
    const stats = analyzeRepo();
    expect(stats.packages.length).toBeGreaterThan(0);
    expect(stats.docFiles).toBeGreaterThan(0);
  });
});
