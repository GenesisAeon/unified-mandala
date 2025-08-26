import { execFile } from 'child_process';
import { promisify } from 'util';
import { CapabilityGuard } from '../packages/os-bridge/CapabilityGuard';

const execFileAsync = promisify(execFile);

async function run(script: string) {
  const guard = new CapabilityGuard();
  guard.enforce('automation.run');
  await execFileAsync('AutoHotkey.exe', [script]);
}

if (require.main === module) {
  const script = process.argv[2];
  if (!script) {
    console.error('Usage: ts-node scripts/ahk-runner.ts <script.ahk>');
    process.exit(1);
  }
  run(script).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
