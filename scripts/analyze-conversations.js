#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
let analyzeConversations, extractTodosFromConversations, markFragmentProcessed;
try {
  ({ analyzeConversations, extractTodosFromConversations } = require('../dist/shared-utils/conversationAnalyzer.js'));
} catch {
  ({ analyzeConversations, extractTodosFromConversations } = require('../packages/shared-utils/conversationAnalyzer'));
}
try {
  ({ markFragmentProcessed } = require('../dist/shared-utils/conversationProgress.js'));
} catch {
  ({ markFragmentProcessed } = require('../packages/shared-utils/conversationProgress'));
}
const yaml = require('yaml');

const convFile = path.join(__dirname, '../docs/sigils/conversations.json');
const progressFile = path.join(__dirname, '../docs/sigils/conversations-progress.json');
const todoFile = path.join(__dirname, '../ToDo.yaml');

const stats = analyzeConversations(convFile);
console.log('Conversations:', stats.conversationCount);
console.log('Messages:', stats.messageCount);
console.log('Authors:', stats.authorCounts);

const todos = extractTodosFromConversations(convFile);
console.log(`Found ${todos.length} TODO hints in conversations.`);

const convs = require(convFile);
convs.forEach(c => markFragmentProcessed(c.id, progressFile));
console.log('Progress file updated.');
