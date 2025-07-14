#!/usr/bin/env node
const glob = require('glob');
const path = require('path');
let validate;
try {
  ({ validateSigillin: validate } = require('../dist/shared-utils/SigillinValidator'));
} catch {
  ({ validateSigillin: validate } = require('../packages/shared-utils/SigillinValidator'));
}

const files = glob.sync('docs/sigils/**/*.{yaml,yml,json}', { nodir: true });
let allOk = true;
files.forEach(file => {
  const { valid, errors } = validate(path.resolve(file));
  if (valid) {
    console.log(`${file}: OK`);
  } else {
    console.error(`${file}: INVALID`, errors);
    allOk = false;
  }
});
process.exitCode = allOk ? 0 : 1;
