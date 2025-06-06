const path = require('path');
const { writeJsonChunks } = require('../packages/shared-utils/jsonFragmenter');

const file = path.join(__dirname, '../docs/sigils/conversations.json');
const dest = path.join(__dirname, '../docs/sigils/conversations');
const chunkSize = parseInt(process.argv[2] || '100', 10);

writeJsonChunks(file, dest, chunkSize);
console.log(`Conversations split into chunks of ${chunkSize}. Output: ${dest}`);
