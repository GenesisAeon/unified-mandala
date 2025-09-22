#!/usr/bin/env ts-node
import { execSync } from 'child_process';
import fs from 'fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

type PantheonPortalAnalyticsCtor =
  typeof import('../packages/pantheon/PantheonPortalAnalytics').PantheonPortalAnalytics;

let analyticsCtorPromise: Promise<PantheonPortalAnalyticsCtor> | null = null;

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

export async function runQA(
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
      const Analytics = await resolveAnalyticsCtor();
      const analytics = new Analytics();
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

async function resolveAnalyticsCtor(): Promise<PantheonPortalAnalyticsCtor> {
  if (!analyticsCtorPromise) {
    analyticsCtorPromise = (async () => {
      const candidates = [
        '../packages/pantheon/PantheonPortalAnalytics',
        '../packages/pantheon/PantheonPortalAnalytics.js',
        '../packages/pantheon/src/PantheonPortalAnalytics.ts',
      ];
      let lastError: unknown;
      for (const specifier of candidates) {
        try {
          const module = await import(specifier);
          const ctor = module.PantheonPortalAnalytics as PantheonPortalAnalyticsCtor | undefined;
          if (ctor) {
            return ctor;
          }
        } catch (error) {
          lastError = error;
        }
      }
      const message = `Unable to locate PantheonPortalAnalytics module. Tried: ${candidates.join(', ')}`;
      if (lastError instanceof Error) {
        throw new Error(message, { cause: lastError });
      }
      throw new Error(message);
    })();
  }
  return analyticsCtorPromise;
}

if (require.main === module) {
  void runQA(undefined, undefined, process.argv[2]).catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
