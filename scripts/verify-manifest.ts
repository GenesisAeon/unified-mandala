#!/usr/bin/env ts-node
import { readFileSync } from 'fs';
import { join } from 'path';
import { verify } from 'crypto';

function main() {
  const [manifestPath, signaturePath, pubKeyPath] = process.argv.slice(2);
  if (!manifestPath) {
    console.error('Usage: verify-manifest <manifest.json> [signature] [publicKey]');
    process.exit(1);
  }
  const sigPath = signaturePath || manifestPath + '.sig';
  const publicKey = readFileSync(pubKeyPath || join('keys', 'ed25519-public.pem'));
  const data = readFileSync(manifestPath);
  const signature = readFileSync(sigPath, 'utf8').trim();
  const ok = verify(null, data, publicKey, Buffer.from(signature, 'base64'));
  if (ok) {
    console.log('Manifest signature verified.');
  } else {
    console.error('Manifest signature verification failed.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
