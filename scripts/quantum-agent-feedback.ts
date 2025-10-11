import { spawnSync } from 'child_process';
import { analyzeTestLog, FeedbackSummary } from './feedback-analyzer';

export function runQuantumAgentTests(
  runCommand: () => string = defaultRunCommand,
): FeedbackSummary {
  const output = runCommand();
  return analyzeTestLog(output);
}

function defaultRunCommand(): string {
  const result = spawnSync('npx', ['vitest', 'run', 'packages/agents/QuantumTheoryAgent.test.ts'], {
    encoding: 'utf8',
  });
  return `${result.stdout ?? ''}${result.stderr ?? ''}`;
}

if (require.main === module) {
  const summary = runQuantumAgentTests();
  console.log(JSON.stringify(summary, null, 2));
}
