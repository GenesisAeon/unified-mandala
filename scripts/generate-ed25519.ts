#!/usr/bin/env ts-node
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { generateKeyPairSync } from 'crypto';

function main() {
  const dir = join(process.cwd(), 'keys');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const { publicKey, privateKey } = generateKeyPairSync('ed25519');
  writeFileSync(join(dir, 'ed25519-public.pem'), publicKey.export({ type: 'spki', format: 'pem' }));
  writeFileSync(join(dir, 'ed25519-private.pem'), privateKey.export({ type: 'pkcs8', format: 'pem' }));
  console.log('Generated Ed25519 key pair in keys/');
}

if (require.main === module) {
  main();
}
