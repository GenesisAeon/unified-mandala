const path = require('path');
let extractCodeSnippetsFromFile;
try {
  ({ extractCodeSnippetsFromFile } = require('../dist/shared-utils/jsonFragmenter.js'));
} catch {
  ({ extractCodeSnippetsFromFile } = require('../packages/shared-utils/jsonFragmenter'));
}

const file = path.join(__dirname, '../docs/sigils/conversations.json');
const dest = path.join(__dirname, '../docs/sigils/code-archive');

extractCodeSnippetsFromFile(file, dest);
console.log('Code snippets extracted to', dest);
