#!/usr/bin/env node
const path = require('path');
let { mergeJsonChunks } = (() => {
  try {
    return require('../dist/shared-utils/jsonFragmenter.js');
  } catch {
    return require('../packages/shared-utils/jsonFragmenter');
  }
})();

function run(dir = path.join(__dirname, '../docs/sigils/conversations'), out = path.join(__dirname, '../docs/sigils/conversations.json')) {
  mergeJsonChunks(dir, out);
  console.log(`Conversations merged into ${out}`);
}

if (require.main === module) {
  run(process.argv[2], process.argv[3]);
}

module.exports = { run };
