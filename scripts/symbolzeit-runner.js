#!/usr/bin/env node
let SYMBOLZEIT;
try {
  SYMBOLZEIT = require('../dist/packages/aeon-shell/symbolzeit.js').SYMBOLZEIT;
} catch {
  SYMBOLZEIT = require('../packages/aeon-shell/symbolzeit').SYMBOLZEIT;
}

function run() {
  const phase = SYMBOLZEIT.phase;
  console.log(`[SymbolzeitRunner] ${phase} ${SYMBOLZEIT.date}`);
  switch (phase) {
    case 'morgen':
      console.log('-> fetch-conversations');
      break;
    case 'mittag':
      console.log('-> update-chronopoem');
      break;
    case 'abend':
      console.log('-> consolidate-memory');
      break;
    case 'nacht':
      console.log('-> run backups');
      break;
    default:
      console.log('-> no scheduled tasks');
  }
}

run();
