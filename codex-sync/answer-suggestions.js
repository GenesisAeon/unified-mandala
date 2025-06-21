const fs = require('fs');
const yaml = require('js-yaml');

const suggestionsFile = 'codex/suggestions.yaml';
if (!fs.existsSync(suggestionsFile)) {
  console.log('Keine Vorschlaege gefunden.');
  process.exit(0);
}

const suggestions = yaml.load(fs.readFileSync(suggestionsFile, 'utf8')) || [];
if (!Array.isArray(suggestions) || suggestions.length === 0) {
  console.log('Keine Vorschlaege im YAML.');
  process.exit(0);
}

console.log('Codex-Antwortsystem aktiviert:');
for (const suggestion of suggestions) {
  console.log('- ' + suggestion);
}
