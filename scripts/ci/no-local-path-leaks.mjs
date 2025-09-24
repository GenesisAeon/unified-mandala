import { exec as execCallback } from 'node:child_process';
import process from 'node:process';
import { promisify } from 'node:util';

const exec = promisify(execCallback);

const patterns = [
  {
    regex: /C:\\Users\\[^\\\s]+\\[^\\\s]+/i,
    message: 'Absolute Windows user paths detected (C:\\Users\\...).',
  },
  {
    regex: /[A-Z]:\\[^\n\r]*/,
    message: 'Windows absolute path detected (drive letter).',
  },
  {
    regex: /APPDATA\\Cypress\\Cache/i,
    message: 'Cypress cache path detected; ensure caches stay outside the repo.',
  },
  {
    regex: /BEGIN RSA PRIVATE KEY/,
    message: 'Private key material detected.',
  },
  {
    regex: /OPENAI_API_KEY\s*=\s*sk-[A-Za-z0-9]/i,
    message: 'OpenAI API key detected.',
  },
];

function fail(reason) {
  process.stderr.write(`\n[guard:no-local-paths] ${reason}\n`);
  process.stderr.write(
    '[guard:no-local-paths] Commit aborted. Remove the artefact or extend .gitignore.\n',
  );
  process.exit(1);
}

const diff = (
  await exec('git diff --cached -U0 -- . ":(exclude)scripts/ci/no-local-path-leaks.mjs"')
).stdout;
if (!diff.trim()) {
  process.exit(0);
}

for (const { regex, message } of patterns) {
  regex.lastIndex = 0;
  if (regex.test(diff)) {
    fail(message);
  }
}

process.exit(0);
