const fs = require('fs');
const path = require('path');

function addTransitionHistory(sigilFile) {
  const progressFile = path.join(__dirname, '../advancedprogress.json');
  let data = {};
  if (fs.existsSync(progressFile)) {
    data = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
  }
  if (!data.transitions) data.transitions = [];
  data.transitions.push({
    sigil: path.relative(path.join(__dirname, '..'), sigilFile),
    timestamp: new Date().toISOString(),
  });
  fs.writeFileSync(progressFile, JSON.stringify(data, null, 2));
}

if (require.main === module) {
  const sigil =
    process.argv[2] || path.join(__dirname, '../docs/sigils/aeon-transition.sigil.json');
  addTransitionHistory(sigil);
  console.log('transition history updated');
}

module.exports = { addTransitionHistory };
