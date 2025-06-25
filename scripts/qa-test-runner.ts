#!/usr/bin/env ts-node
import { execSync } from 'child_process';
import fs from 'fs';

export function runQA(lintCommand = 'pnpm lint', testCommand = 'pnpm test') {
  const logFile = 'qa-report.log';
  const options = { stdio: 'inherit' as const };
  if (!fs.existsSync('node_modules')) {
    console.error("node_modules not found. Bitte zuerst 'pnpm install' ausführen.");
    process.exit(1);
  }
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
