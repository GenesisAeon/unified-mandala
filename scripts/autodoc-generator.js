const fs = require('fs');
const path = require('path');

function extractComments(file) {
  const content = fs.readFileSync(file, 'utf8');
  const regex = /\/\*\*([\s\S]*?)\*\//g;
  const docs = [];
  let match;
  while ((match = regex.exec(content))) {
    const cleaned = match[1].split('\n').map(l => l.replace(/^\s*\* ?/, '')).join('\n').trim();
    if (cleaned) docs.push(cleaned);
  }
  return docs.join('\n\n');
}

function generateDocs(file, outDir) {
  const md = extractComments(file);
  if (!md) return null;
  const base = path.basename(file, path.extname(file));
  const outFile = path.join(outDir, `${base}.md`);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, md);
  return outFile;
}

if (require.main === module) {
  const [src, outDir = path.join('docs', 'autodoc')] = process.argv.slice(2);
  if (!src) {
    console.error('Usage: node autodoc-generator.js <file> [outDir]');
    process.exit(1);
  }
  const out = generateDocs(src, outDir);
  if (out) console.log('Generated', out);
}

module.exports = { generateDocs };
