#!/usr/bin/env ts-node
import { execSync } from 'child_process';
import fs from 'fs';
import { PantheonPortalAnalytics } from '../packages/pantheon/PantheonPortalAnalytics';

function fourierPeak(text: string): number {
  const n = text.length;
  let peak = 0;
  for (let k = 0; k < n; k++) {
    let re = 0;
    let im = 0;
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * k * i) / n;
      const value = text.charCodeAt(i);
      re += value * Math.cos(angle);
      im -= value * Math.sin(angle);
    }
    const mag = Math.sqrt(re * re + im * im);
    if (mag > peak) peak = mag;
  }
  return peak;
}

export function runQA(
  lintCommand = 'pnpm lint',
  testCommand = 'pnpm test',
  promptsFile?: string,
) {
  const logFile = 'qa-report.log';
  const options = { stdio: 'inherit' as const };
  if (!fs.existsSync('node_modules')) {
    console.error("node_modules not found. Bitte zuerst 'pnpm install' ausführen.");
    process.exit(1);
  }
  try {
    execSync(lintCommand, options);
    execSync(testCommand, options);
    if (promptsFile && fs.existsSync(promptsFile)) {
      const analytics = new PantheonPortalAnalytics();
      const data = JSON.parse(fs.readFileSync(promptsFile, 'utf-8'));
      (data.prompts || []).forEach((p: { input: string }) => {
        analytics.recordEvent('prompt');
        analytics.recordFourierPeak(fourierPeak(p.input));
      });
      fs.writeFileSync(
        'pantheon-portal-analytics.log',
        JSON.stringify(analytics.getStats(), null, 2),
      );
    }
    fs.writeFileSync(logFile, `${new Date().toISOString()} QA successful\n`);
  } catch (err) {
    fs.writeFileSync(logFile, `${new Date().toISOString()} QA failed: ${err}\n`);
    throw err;
  }
}

if (require.main === module) {
  runQA(undefined, undefined, process.argv[2]);
}
