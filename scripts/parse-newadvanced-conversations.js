const path = require('path');
const { grepJsonArrayFile } = require('../packages/shared-utils/jsonFragmenter');

const file = path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
const dest = path.join(__dirname, '../GenesisAeonZIPMEM/newadvancedconversations');
const keyword = process.argv[2] || 'TODO';
const regex = new RegExp(keyword, 'i');

const matches = grepJsonArrayFile(file, dest, regex);
console.log(`Parsed ${matches.length} fragments containing '${keyword}'. Output: ${dest}`);

