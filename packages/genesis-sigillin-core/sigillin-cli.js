#!/usr/bin/env node
const { validateSigillin } = require('./dist/sigillin-validator');

const file = process.argv[2];
if (!file) {
  console.error('Usage: sigillin-cli <file>');
  process.exit(1);
}

if (validateSigillin(file)) {
  console.log('Valid sigillin');
} else {
  process.exit(1);
}
