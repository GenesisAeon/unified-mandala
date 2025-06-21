const fs = require('fs');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node nucleon-scanner-analysis.js <logfile>');
  process.exit(1);
}

const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
const errors = lines.filter(l => /error/i.test(l));
console.log(`Gefundene Fehler: ${errors.length}`);
