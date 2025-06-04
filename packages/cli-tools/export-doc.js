#!/usr/bin/env node
const fs = require('fs');
const { CREPManager } = require('../crep-engine/CREPManager');

const crep = new CREPManager();
const history = crep.getCREPHistory();
const docs = ['# CREP Dokumentation', '## CREP-Historie:'];
history.forEach(e => {
  docs.push(`- ${e.timestamp.toISOString()}: C=${e.C}, R=${e.R}, E=${e.E}, P=${e.P}`);
});
fs.writeFileSync('CREPDocExport.md', docs.join('\n'));
console.log('CREPDocExport.md geschrieben.');
