#!/usr/bin/env ts-node
import readline from 'node:readline/promises';
import process from 'node:process';

async function createSpace(name: string) {
  console.log(`Creating space "${name}"...`);
  // TODO: integrate with spaces API
}

async function registerPeer(space: string, peer: string) {
  console.log(`Registering peer "${peer}" in space "${space}"...`);
  // TODO: call peer registration API
}

export async function runSetupWizard() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    const space = await rl.question('Space name: ');
    const peer = await rl.question('Peer name: ');
    await createSpace(space);
    await registerPeer(space, peer);
    console.log('Setup complete.');
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  runSetupWizard().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
