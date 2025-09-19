#!/usr/bin/env node
import { PROVIDERS, updateRegistryFile, writeBridgeArtifacts } from './lib/interai-bridges.mjs';

async function run() {
  for (const provider of PROVIDERS) {
    await writeBridgeArtifacts(provider);
  }
  await updateRegistryFile();
  console.log('\n✅ Inter-AI Sigillin bridges scaffolded.');
}

run().catch((e) => {
  console.error('Scaffold error:', e);
  process.exit(1);
});
