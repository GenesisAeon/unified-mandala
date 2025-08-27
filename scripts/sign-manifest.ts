#!/usr/bin/env ts-node
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { sign } from 'crypto';

function main() {
  const [manifestPath, keyPath] = process.argv.slice(2);
  if (!manifestPath) {
    console.error('Usage: sign-manifest <manifest.json> [privateKey]');
    process.exit(1);
  }
  const privateKey = readFileSync(keyPath || join('keys', 'ed25519-private.pem'));
  const data = readFileSync(manifestPath);
  const signature = sign(null, data, privateKey).toString('base64');
  writeFileSync(manifestPath + '.sig', signature);
  console.log(`Signature written to ${manifestPath}.sig`);
}

if (require.main === module) {
  main();
}
