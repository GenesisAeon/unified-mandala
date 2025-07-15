#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
function load(mod) {
  const dist = path.join(__dirname, 'dist', mod + '.js');
  if (fs.existsSync(dist)) return require(dist);
  const src = path.join(__dirname, mod + '.ts');
  if (fs.existsSync(src)) {
    require('ts-node/register');
    return require(src);
  }
  return require('./' + mod);
}
const { SigillinGenerator } = load('SigillinGenerator');
const { validateSigillin } = load('sigillin-validator');

function usage() {
  console.log(`Usage: sigillin-cli <command> [options]
Commands:
  create <file> <id> <type> <status> <creator>
  validate <file>
  list-relations <file>
  bump-version <file>
`);
}

const [, , command, ...args] = process.argv;

switch (command) {
  case 'create': {
    const [file, id, type, status, creator] = args;
    if (!file || !id || !type || !status || !creator) {
      usage();
      process.exit(1);
    }
    const sig = SigillinGenerator(id, type, status, creator);
    fs.writeFileSync(file, JSON.stringify(sig, null, 2));
    console.log(`Created ${file}`);
    break;
  }
  case 'validate': {
    const [file] = args;
    if (!file) {
      usage();
      process.exit(1);
    }
    if (validateSigillin(file)) {
      console.log('Valid sigillin');
    } else {
      process.exit(1);
    }
    break;
  }
  case 'list-relations': {
    const [file] = args;
    if (!file) {
      usage();
      process.exit(1);
    }
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    (data.related_sigils || []).forEach(r => {
      console.log(`${r.id} (${r.relation})`);
    });
    break;
  }
  case 'bump-version': {
    const [file] = args;
    if (!file) {
      usage();
      process.exit(1);
    }
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const parts = data.schema_version.split('.').map(Number);
    parts[2] = (parts[2] || 0) + 1;
    data.schema_version = parts.join('.');
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`Bumped version to ${data.schema_version}`);
    break;
  }
  default:
    usage();
    process.exit(1);
}
