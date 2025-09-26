#!/usr/bin/env node
// Guard to prevent committing .env files or secrets.
// Blocks staged files matching .env, .env.* or any path segment starting with .env
import { execSync } from 'node:child_process';

const die = (msg) => {
  console.error(`\n[guard:no-dotenv] ${msg}`);
  process.exit(1);
};

let files = '';
try {
  files = execSync('git diff --name-only --cached', { stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim();
} catch {
  // If we cannot read staged files, fail closed
  die('Cannot read staged files.');
}

if (!files) process.exit(0);

const bad = [];
const patterns = [
  /^\.env(\..*)?$/i, // .env, .env.local, .env.production.local, etc.
  /(?:^|\/)\.env(\..*)?(?:$|\/)/i, // any path segment that is .env*
];

for (const f of files.split('\n')) {
  if (patterns.some((re) => re.test(f))) bad.push(f);
}

if (bad.length) {
  die(
    `Blocked commit: environment files detected.\n\n  ${bad.join('\n  ')}\n\nAdd them to .gitignore or unstage with:\n  git restore --staged ${bad.map((s) => `'${s}'`).join(' ')}`,
  );
}

process.exit(0);
