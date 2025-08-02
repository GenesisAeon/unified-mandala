import { readFileSync } from 'fs';

export interface FeedbackSummary {
  total: number;
  passed: number;
  failed: number;
}

export function analyzeTestLog(content: string): FeedbackSummary {
  const lines = content.split(/\r?\n/).filter(Boolean);
  let passed = 0;
  let failed = 0;
  for (const line of lines) {
    if (line.includes('PASS')) passed++;
    if (line.includes('FAIL')) failed++;
  }
  return { total: passed + failed, passed, failed };
}

if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: ts-node feedback-analyzer.ts <logfile>');
    process.exit(1);
  }
  const content = readFileSync(file, 'utf8');
  const summary = analyzeTestLog(content);
  console.log(JSON.stringify(summary, null, 2));
}
