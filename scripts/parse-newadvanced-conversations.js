const path = require('path');
const { grepJsonArrayFile } = require('../packages/shared-utils/jsonFragmenter');

function parseNewAdvancedConversations(filePath, destDir, keyword = 'TODO') {
  const regex = new RegExp(keyword, 'i');
  return grepJsonArrayFile(filePath, destDir, regex);
}

if (require.main === module) {
  const file = path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
  const dest = path.join(__dirname, '../GenesisAeonZIPMEM/newadvancedconversations');
  const keyword = process.argv[2] || 'TODO';
  const matches = parseNewAdvancedConversations(file, dest, keyword);
  console.log(`Parsed ${matches.length} fragments containing '${keyword}'. Output: ${dest}`);
}

module.exports = { parseNewAdvancedConversations };
