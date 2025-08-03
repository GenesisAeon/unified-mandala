#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const convFile = path.join(__dirname, '../docs/sigils/conversations.json');
const fallbackFile = path.join(
  __dirname,
  '../docs/sigils/newadvancedconversations.json'
);
const kontextFile = path.join(__dirname, '../kontext.json');

function loadConversations(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function categorize(title) {
  const t = title.toLowerCase();
  if (t.includes('codex')) return 'codex';
  if (t.includes('genesisos')) return 'genesisos';
  if (t.includes('mandala')) return 'unified_mandala';
  if (t.includes('aeonshell')) return 'aeonshell';
  if (t.includes('genesisaeon')) return 'genesis_aeon';
  if (t.includes('nukleon')) return 'nukleon_scanner';
  if (t.includes('sigillin')) return 'sigillin';
  if (t.includes('innovation')) return 'innovation';
  return null;
}

function run(source = convFile, outFile = kontextFile) {
  let convs = loadConversations(source);
  if (!convs) {
    convs = loadConversations(fallbackFile);
  }
  if (!convs) {
    throw new Error('No conversations file found');
  }
  const topics = {
    codex: [], genesisos: [], unified_mandala: [], aeonshell: [],
    genesis_aeon: [], nukleon_scanner: [], sigillin: [], innovation: []
  };
  convs.forEach(c => {
    const cat = categorize(c.title || '');
    if (cat && !topics[cat].includes(c.title)) topics[cat].push(c.title);
  });
  const kontext = {
    project: 'GenesisAeon',
    repository: 'unified-mandala',
    summary: `Automatisch generiert aus ${convs.length} Gespr\u00e4chen.`,
    topics
  };
  fs.writeFileSync(outFile, JSON.stringify(kontext, null, 2));
  console.log('kontext.json updated.');
}

if (require.main === module) run();

module.exports = { run };
