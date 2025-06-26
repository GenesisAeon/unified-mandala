const fs = require('fs');
const path = require('path');
const slugify = str => str
  .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toUpperCase();

const src = path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
const destRoot = path.join(__dirname, '../GenesisAeonZIPMEM/newadvancedconversations');

const data = JSON.parse(fs.readFileSync(src, 'utf8'));

for (const convo of data) {
  const title = convo.title || 'UNTITLED';
  const slug = slugify(title);
  const outDir = path.join(destRoot, slug);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const mapping = convo.mapping || {};
  const messages = Object.values(mapping).filter(m => m && m.message).map(m => m.message);
  messages.forEach((msg, idx) => {
    const ts = msg.create_time ? new Date(msg.create_time * 1000).toISOString() : '';
    const content = (msg.content && msg.content.parts) ? msg.content.parts.join('\n') : '';
    const yaml = [
      `id: ${msg.id}`,
      `author: ${msg.author?.role || ''}`,
      'content: |-',
      ...content.split('\n').map(line => '  ' + line),
      `timestamp: ${ts}`
    ].join('\n');
    const outPath = path.join(outDir, `msg_${String(idx + 1).padStart(4, '0')}.yaml`);
    fs.writeFileSync(outPath, yaml, 'utf8');
  });
}
console.log(`Generated fragments for ${data.length} conversations in ${destRoot}`);
