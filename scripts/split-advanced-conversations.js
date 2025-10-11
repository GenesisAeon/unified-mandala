const path = require('path');
const { writeJsonChunks } = require('../packages/shared-utils/jsonFragmenter');

const file =
  process.env.ADV_SRC || path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
const dest =
  process.env.ADV_DEST || path.join(__dirname, '../GenesisAeonZIPMEM/newadvancedconversations');
const chunkSize = parseInt(process.argv[2] || '100', 10);

writeJsonChunks(file, dest, chunkSize);
console.log(`Advanced conversations split into chunks of ${chunkSize}. Output: ${dest}`);
