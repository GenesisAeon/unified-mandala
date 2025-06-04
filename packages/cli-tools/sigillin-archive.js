#!/usr/bin/env node
const fs = require('fs');
const glob = require('glob');
const path = require('path');

function poeticNote(type) {
  switch (type) {
    case 'poetic-root': return '🌱 Ursprung und Spross';
    case 'fallback-anchor': return '🛟 Heimkehrpunkt';
    case 'crep-trigger': return '⚡ Emergenz-Impuls';
    case 'session-memory': return '🧠 Erinnerungsfokus';
    case 'ethik-node': return '⚖️ Ethischer Kern';
    default: return '';
  }
}

const files = glob.sync(path.join(__dirname, '../../**/*.sigil.json'));
let archive = ['# Sigillin-Archiv', ''];

files.forEach(file => {
  const sigil = JSON.parse(fs.readFileSync(file, 'utf8'));
  archive.push(
    `## ${sigil.id} (${sigil.type})`,
    `*Status:* ${sigil.status}`,
    `*Erstellt:* ${sigil.created_at}`,
    `*Poetik:* ${poeticNote(sigil.type)}`,
    `*Änderungen:* ${sigil.changes ? sigil.changes.join(', ') : '-'}`,
    ''
  );
});

fs.writeFileSync('SigillinArchive.md', archive.join('\n'));
console.log('SigillinArchive.md exportiert.');
