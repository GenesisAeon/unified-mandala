import { readFileSync, writeFileSync } from 'fs';
import os from 'os';
import path from 'path';
import { promisify } from 'util';
import { execFile } from 'child_process';
import { CapabilityGuard } from '../packages/os-bridge/CapabilityGuard';
import { Macro, validateMacro } from '../packages/automation/MacroDSL';
import { compileToAHK } from '../packages/automation/AHKCompiler';

const execFileAsync = promisify(execFile);

async function run(macroPath: string) {
  const macro: Macro = JSON.parse(readFileSync(macroPath, 'utf8'));
  const errors = validateMacro(macro);
  if (errors.length > 0) {
    throw new Error(`Invalid macro: ${errors.join(', ')}`);
  }
  const ahk = compileToAHK(macro);
  const tmpFile = path.join(os.tmpdir(), `macro-${Date.now()}.ahk`);
  writeFileSync(tmpFile, ahk, 'utf8');
  const guard = new CapabilityGuard();
  guard.enforce('automation.run');
  await execFileAsync('AutoHotkey.exe', [tmpFile]);
}

if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: ts-node scripts/macro-exec.ts <macro.json>');
    process.exit(1);
  }
  run(file).catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

