#!/usr/bin/env node
const path = require('path');
let { markFragmentProcessed };
try {
  ({ markFragmentProcessed } = require('../dist/shared-utils/conversationProgress.js'));
} catch {
  ({ markFragmentProcessed } = require('../packages/shared-utils/conversationProgress'));
}

const id = process.argv[2];
if (!id) {
  console.error('Usage: mark-fragment <id>');
  process.exit(1);
}
const file = path.join(__dirname, '../docs/sigils/conversations-progress.json');
markFragmentProcessed(id, file);
console.log(`Fragment ${id} marked as processed.`);
