#!/usr/bin/env node
/* eslint-disable no-unused-vars */
const path = require('path');
let analyzeConversations, extractTodosFromConversations, markFragmentProcessed;
try {
  ({
    analyzeConversations,
    extractTodosFromConversations,
  } = require('../dist/shared-utils/conversationAnalyzer.js'));
} catch {
  ({
    analyzeConversations,
    extractTodosFromConversations,
  } = require('../packages/shared-utils/conversationAnalyzer'));
}
try {
  ({ markFragmentProcessed } = require('../dist/shared-utils/conversationProgress.js'));
} catch {
  ({ markFragmentProcessed } = require('../packages/shared-utils/conversationProgress'));
}
const convFile = path.join(__dirname, '../docs/sigils/conversations.json');
const progressFile = path.join(__dirname, '../docs/sigils/conversations-progress.json');

const stats = analyzeConversations(convFile);
console.log('Conversations:', stats.conversationCount);
console.log('Messages:', stats.messageCount);
console.log('Authors:', stats.authorCounts);

const todos = extractTodosFromConversations(convFile);
console.log(`Found ${todos.length} TODO hints in conversations.`);

const convs = require(convFile);
convs.forEach((c) => markFragmentProcessed(c.id, progressFile));
console.log('Progress file updated.');
