#!/usr/bin/env node
const { execSync } = require('child_process');

function runTypedoc() {
  execSync('npx typedoc', { stdio: 'inherit' });
  console.log('API docs generated in docs/api');
}

if (require.main === module) {
  runTypedoc();
}

module.exports = { runTypedoc };
