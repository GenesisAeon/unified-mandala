#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const [, , targetScript, ...rest] = process.argv;

if (!targetScript) {
  console.error('Usage: node scripts/run-powershell.mjs <script.ps1> [args...]');
  process.exit(1);
}

const resolvedScript = path.resolve(targetScript);

if (!existsSync(resolvedScript)) {
  console.error(`PowerShell script not found: ${resolvedScript}`);
  process.exit(1);
}

const candidateCommands = [];

if (process.env.POWERSHELL && process.env.POWERSHELL.trim().length > 0) {
  candidateCommands.push(process.env.POWERSHELL.trim());
}

if (process.platform === 'win32') {
  candidateCommands.push('pwsh', 'powershell');
} else {
  candidateCommands.push('pwsh');
}

let selectedCommand;
let probeError;

for (const command of candidateCommands) {
  const result = spawnSync(
    command,
    ['-NoLogo', '-NoProfile', '-Command', '$PSVersionTable.PSVersion.ToString()'],
    {
      stdio: 'pipe',
      encoding: 'utf-8',
    },
  );

  if (result.error) {
    probeError = result.error;
    continue;
  }

  if (result.status === 0) {
    selectedCommand = command;
    break;
  }

  probeError = new Error(
    result.stderr || `PowerShell candidate exited with status ${result.status}`,
  );
}

if (!selectedCommand) {
  const attempted = candidateCommands.length > 0 ? candidateCommands.join(', ') : 'pwsh';
  const details = probeError ? `\nLast error: ${probeError.message}` : '';
  console.error(
    `Unable to locate a working PowerShell interpreter. Tried: ${attempted}.${details}`,
  );
  console.error(
    'Install PowerShell 7 (pwsh) or set the POWERSHELL environment variable to a valid executable.',
  );
  process.exit(1);
}

const lowerCommand = selectedCommand.toLowerCase();
const isWindowsPowerShell =
  lowerCommand.endsWith('powershell') || lowerCommand.endsWith('powershell.exe');

const invocationArgs = isWindowsPowerShell
  ? ['-NoLogo', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', resolvedScript, ...rest]
  : ['-NoLogo', '-NoProfile', '-File', resolvedScript, ...rest];

const child = spawnSync(selectedCommand, invocationArgs, {
  stdio: 'inherit',
});

if (child.error) {
  console.error(`Failed to invoke ${selectedCommand}: ${child.error.message}`);
  process.exit(child.status ?? 1);
}

process.exit(child.status ?? 0);
