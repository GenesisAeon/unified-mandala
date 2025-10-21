#!/usr/bin/env node
/* Runs `opa test` against the ethics OPA folder with sane defaults.
   - Honors OPA_BIN or a local ./bin/opa, else uses `opa` from PATH
   - Pass through extra CLI args (e.g. --verbose)
   - Exits non-zero on failure (CI friendly)
*/
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_DIR = path.join(ROOT, 'apps', 'ethics-api', 'opa');

const fromEnv = process.env.OPA_BIN && process.env.OPA_BIN.trim();
const localBin = path.join(ROOT, 'bin', process.platform === 'win32' ? 'opa.exe' : 'opa');
const opaBin = fromEnv || (fs.existsSync(localBin) ? localBin : 'opa');

const opaDir = process.env.OPA_DIR ? path.resolve(process.env.OPA_DIR) : DEFAULT_DIR;

const baseArgs = ['test', opaDir, '-v'];
const extra = process.argv.slice(2);
const args = baseArgs.concat(extra);

function hint() {
  const msg = `
[opa:test] Could not execute OPA. Make sure the 'opa' binary is available.
Options:
  • Set OPA_BIN to the full path of the opa binary
  • Put a platform binary in ./bin/opa (executable)
  • Install locally:
      - macOS:   brew install opa
      - Linux:   curl -L -o opa https://openpolicyagent.org/downloads/latest/opa_linux_amd64_static && chmod +x opa && sudo mv opa /usr/local/bin/
      - Windows: winget install OpenPolicyAgent.opa   (or scoop install opa)
`;
  console.error(msg);
}

try {
  const child = spawn(opaBin, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  child.on('error', (err) => {
    console.error(`[opa:test] spawn error: ${err?.message ?? err}`);
    hint();
    process.exit(1);
  });
  child.on('exit', (code) => {
    process.exit(code ?? 1);
  });
} catch (err) {
  console.error(`[opa:test] failed: ${err?.message ?? err}`);
  hint();
  process.exit(1);
}
