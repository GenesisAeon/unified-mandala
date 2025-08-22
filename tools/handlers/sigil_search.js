const fs = require('fs');
const path = require('path');

module.exports = async function sigil_search({ query, tag }) {
  const file = path.join(__dirname, '../../data/sigils/sigillin.jsonl');
  const q = String(query || '').toLowerCase();
  const t = tag ? String(tag).toLowerCase() : null;
  const results = [];

  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      const haystack = JSON.stringify(obj).toLowerCase();
      if (!haystack.includes(q)) continue;
      if (t && !haystack.includes(t)) continue;
      results.push(obj);
    } catch {
      // ignore malformed lines
    }
  }
  return results;
};
