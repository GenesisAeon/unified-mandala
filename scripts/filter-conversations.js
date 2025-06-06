const path = require('path');
const { grepJsonArrayFile } = require('../packages/shared-utils/jsonFragmenter');
const file = path.join(__dirname, '../docs/sigils/conversations.json');
const dest = path.join(__dirname, '../docs/sigils/conversations');
const keyword = process.argv[2] || 'TODO';
const regex = new RegExp(keyword, 'i');
const matches = grepJsonArrayFile(file, dest, regex);
console.log(`Filtered ${matches.length} items containing '${keyword}'. Output: ${dest}`);
