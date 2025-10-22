#!/usr/bin/env node
import { createWriteStream, existsSync, mkdirSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { request } from 'node:https';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const BIN_DIR = path.join(ROOT, 'bin');
const VERSION = (process.env.OPA_VERSION || 'v0.66.0').replace(/^v?/, 'v');
const isWindows = process.platform === 'win32';
const platformName = isWindows
  ? 'opa_windows_amd64.exe'
  : process.platform === 'darwin'
    ? 'opa_darwin_amd64'
    : 'opa_linux_amd64_static';
const downloadUrl = `https://openpolicyagent.org/downloads/${VERSION}/${platformName}`;
const targetPath = path.join(BIN_DIR, isWindows ? 'opa.exe' : 'opa');

if (!existsSync(BIN_DIR)) {
  mkdirSync(BIN_DIR, { recursive: true });
}

if (existsSync(targetPath)) {
  console.log('OPA already present at', targetPath);
  process.exit(0);
}

console.log('Downloading', downloadUrl);

try {
  await new Promise((resolve, reject) => {
    request(downloadUrl, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download OPA binary. HTTP ${res.statusCode}`));
        res.resume();
        return;
      }

      const output = createWriteStream(targetPath, { mode: 0o755 });
      pipeline(res, output).then(resolve).catch(reject);
    })
      .on('error', reject)
      .end();
  });

  console.log('Saved to', targetPath);
} catch (error) {
  console.error('OPA download failed:', error instanceof Error ? error.message : error);
  try {
    if (existsSync(targetPath)) {
      unlinkSync(targetPath);
    }
  } catch {
    // ignore cleanup errors
  }
  process.exit(1);
}
