const fs = require('fs');
const text = fs.readFileSync(process.argv[2], 'utf8');
const keyword = process.argv[3];
const parsed = JSON.parse(text);
for (const conv of parsed) {
  for (const id in conv.mapping) {
    const m = conv.mapping[id].message;
    if (m && m.content && m.content.parts) {
      const part = m.content.parts[0];
      if (typeof part === 'string' && part.includes(keyword)) {
        console.log(`${conv.title}:${id}\n${part.slice(0, 200).replace(/\n/g, ' ')}\n`);
      }
    }
  }
}
