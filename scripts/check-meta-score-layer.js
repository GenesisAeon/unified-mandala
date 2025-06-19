const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'apps/sharedream-interface/hooks/useMetaScores.ts',
  'apps/sharedream-interface/hooks/useMetaScores.test.ts',
  'apps/sharedream-interface/pages/api/meta-scores.ts',
  'apps/sharedream-interface/pages/api/meta-scores.test.ts',
  'apps/sharedream-interface/components/MetaScoreChart.tsx',
  'apps/sharedream-interface/components/MetaScoreChart.test.tsx',
  'apps/sharedream-interface/components/MetaScoreChart.stories.tsx',
  'apps/sharedream-interface/components/MetaScoreDisplay.tsx',
  'apps/sharedream-interface/components/MetaScoreDisplay.stories.tsx'
];

function checkFiles() {
  let allPresent = true;
  for (const file of requiredFiles) {
    const exists = fs.existsSync(file);
    console.log(`${file}: ${exists ? 'OK' : 'FEHLT'}`);
    if (!exists) allPresent = false;
  }
  return allPresent;
}

function checkHookEndpoint() {
  const hookPath = 'apps/sharedream-interface/hooks/useMetaScores.ts';
  const content = fs.readFileSync(hookPath, 'utf8');
  const usesEndpoint = content.includes('/api/meta-scores');
  console.log(`useMetaScores fetches /api/meta-scores: ${usesEndpoint ? 'OK' : 'FEHLT'}`);
  return usesEndpoint;
}

if (require.main === module) {
  const ok = checkFiles() && checkHookEndpoint();
  if (!ok) {
    console.error('Meta score layer is inconsistent');
    process.exitCode = 1;
  }
}

module.exports = { checkFiles, checkHookEndpoint };

