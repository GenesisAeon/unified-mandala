#!/usr/bin/env node
const path = require('path');
const { parseAdvancedConversations } = require('./parse-advanced-conversations.js');

(async () => {
  try {
    const file = path.join(__dirname, '../docs/sigils/advancedconversations.json');
    const dest = path.join(__dirname, '../docs/sigils/advancedconversations');
    parseAdvancedConversations(file, dest);
    await fetch('http://localhost:3000/usecases/todo/parse');
    await fetch('http://localhost:3000/socialgood/match');
    console.log('Parsing and SocialGood matching triggered');
  } catch (err) {
    console.error('Workflow failed', err);
    process.exit(1);
  }
})();
