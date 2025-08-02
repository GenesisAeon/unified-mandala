import { analyzeTestLog } from './feedback-analyzer';

describe('analyzeTestLog', () => {
  it('counts passed and failed tests', () => {
    const log = `PASS test1\nFAIL test2\nPASS test3`;
    expect(analyzeTestLog(log)).toEqual({ total: 3, passed: 2, failed: 1 });
  });
});
