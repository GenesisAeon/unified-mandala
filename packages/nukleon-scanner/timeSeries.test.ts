import { simulateTimeSeries } from './timeSeries';

describe('simulateTimeSeries', () => {
  it('accumulates average phi across transcripts', () => {
    const transcripts = ['phi:1', 'phi:2', 'phi:3 phi:1'];
    const series = simulateTimeSeries(transcripts);
    expect(series).toHaveLength(3);
    expect(series[0]).toBeCloseTo(1);
    expect(series[1]).toBeCloseTo(1.5);
    expect(series[2]).toBeCloseTo(1.75);
  });
});
