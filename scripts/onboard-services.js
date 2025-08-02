#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const readline = require('readline');

const servicesFile = path.resolve(__dirname, '../config/onboarding/services.yaml');
const outDir = path.resolve(__dirname, '../user-config');
const outFile = path.join(outDir, 'services_selected.yaml');

const data = yaml.parse(fs.readFileSync(servicesFile, 'utf8'));
const services = data.services || [];

console.log('Verfügbare Dienste:');
services.forEach((s, idx) => {
  const ext = s.type === 'external' ? ' (extern)' : '';
  console.log(`${idx + 1}. ${s.name}${ext}`);
});

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Nummern auswählen (z.B. 1,3): ', answer => {
  const ids = answer
    .split(',')
    .map(str => parseInt(str.trim(), 10) - 1)
    .filter(i => i >= 0 && i < services.length)
    .map(i => services[i].id);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(outFile, yaml.stringify({ selected: ids }), 'utf8');
  console.log(`\n✅ Dienste konfiguriert: ${ids.join(', ')}`);
  rl.close();
});
