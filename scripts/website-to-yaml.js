const fs = require('fs');
const yaml = require('js-yaml');

async function main() {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: node website-to-yaml.js <url-or-file>');
    process.exit(1);
  }
  let text;
  if (/^https?:/.test(target)) {
    const res = await fetch(target);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    text = await res.text();
  } else {
    text = fs.readFileSync(target, 'utf8');
  }
  const data = { source: target, content: text };
  const out = yaml.dump(data);
  fs.writeFileSync('codex/website.yaml', out, 'utf8');
  console.log('Saved to codex/website.yaml');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
