#!/usr/bin/env ts-node
import { execSync } from 'child_process';
import fs from 'fs';

export function runQA(lintCommand = 'pnpm lint', testCommand = 'pnpm test') {
  const logFile = 'qa-report.log';
  const options = { stdio: 'inherit' as const };
  try {
    execSync(lintCommand, options);
    execSync(testCommand, options);
    fs.writeFileSync(logFile, `${new Date().toISOString()} QA successful\n`);
  } catch (err) {
    fs.writeFileSync(logFile, `${new Date().toISOString()} QA failed: ${err}\n`);
    throw err;
  }
}

if (require.main === module) {
  runQA();
}
