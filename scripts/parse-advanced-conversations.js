const path = require('path');
const { grepJsonArrayFile } = require('../packages/shared-utils/jsonFragmenter');

function parseAdvancedConversations(filePath, destDir, keyword = 'TODO') {
  const regex = new RegExp(keyword, 'i');
  return grepJsonArrayFile(filePath, destDir, regex);
}

if (require.main === module) {
  const file = path.join(__dirname, '../docs/sigils/advancedconversations.json');
  const dest = path.join(__dirname, '../docs/sigils/advancedconversations');
  const keyword = process.argv[2] || 'TODO';
  const matches = parseAdvancedConversations(file, dest, keyword);
  console.log(
    `Parsed ${matches.length} fragments containing '${keyword}'. Output: ${dest}`
  );
}

module.exports = { parseAdvancedConversations };

