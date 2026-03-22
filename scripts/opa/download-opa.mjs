#!/usr/bin/env node
import { createWriteStream, existsSync, mkdirSync, unlinkSync } from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
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
const downloadUrl = `https://github.com/open-policy-agent/opa/releases/download/${VERSION}/${platformName}`;
const targetPath = path.join(BIN_DIR, isWindows ? 'opa.exe' : 'opa');

if (!existsSync(BIN_DIR)) {
  mkdirSync(BIN_DIR, { recursive: true });
}

if (existsSync(targetPath)) {
  console.log('OPA already present at', targetPath);
  process.exit(0);
}

console.log('Downloading', downloadUrl);

/** Follow up to maxRedirects 3xx responses, resolve with the final IncomingMessage. */
function fetchFollowRedirects(url, maxRedirects = 10) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          if (maxRedirects === 0) {
            reject(new Error('Too many redirects'));
            res.resume();
            return;
          }
          res.resume();
          resolve(fetchFollowRedirects(res.headers.location, maxRedirects - 1));
          return;
        }
        resolve(res);
      })
      .on('error', reject);
  });
}

try {
  const res = await fetchFollowRedirects(downloadUrl);
  if (res.statusCode !== 200) {
    throw new Error(`Failed to download OPA binary. HTTP ${res.statusCode}`);
  }
  const output = createWriteStream(targetPath, { mode: 0o755 });
  await pipeline(res, output);
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
