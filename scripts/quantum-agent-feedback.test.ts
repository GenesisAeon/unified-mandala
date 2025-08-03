import { describe, it, expect } from 'vitest';
import { runQuantumAgentTests } from './quantum-agent-feedback';

function mockRunner() {
  return `PASS QuantumTheoryAgent emits anomaly\nFAIL QuantumTheoryAgent handles safe measurements`;
}

describe('runQuantumAgentTests', () => {
  it('summarizes vitest output', () => {
    const summary = runQuantumAgentTests(mockRunner);
    expect(summary).toEqual({ total: 2, passed: 1, failed: 1 });
  });
});
