#!/usr/bin/env node
const fs = require('fs');
let CREPManager;
if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = {
    getItem: () => null,
    setItem: () => {},
  };
}
try {
  // use compiled version if available
  ({ CREPManager } = require('../../dist/crep-engine/CREPManager.js'));
} catch (e) {
  ({ CREPManager } = require('../crep-engine/CREPManager'));
}

const crep = new CREPManager();
const history = crep.getCREPHistory();
const docs = ['# CREP Dokumentation', '## CREP-Historie:'];
history.forEach(e => {
  docs.push(`- ${e.timestamp.toISOString()}: C=${e.C}, R=${e.R}, E=${e.E}, P=${e.P}`);
});
fs.writeFileSync('CREPDocExport.md', docs.join('\n'));
console.log('CREPDocExport.md geschrieben.');
