const fs = require('fs');
const path = require('path');

const src = process.env.ZIP_SRC || path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
const destRoot = process.env.ZIP_DEST || path.join(__dirname, '../GenesisAeonZIPMEM/newadvancedconversations');

function slugify(str) {
  return str.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function organize() {
  const data = JSON.parse(fs.readFileSync(src, 'utf8'));
  data.forEach(convo => {
    const slug = slugify(convo.title || convo.id || 'conversation');
    const dir = path.join(destRoot, slug);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, 'conversation.json');
    fs.writeFileSync(out, JSON.stringify(convo, null, 2));
  });
  console.log(`Organized ${data.length} conversations in ${destRoot}`);
}

if (require.main === module) organize();

module.exports = { organize };
