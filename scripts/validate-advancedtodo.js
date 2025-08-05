const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function loadYaml(file) {
  try {
    return yaml.load(fs.readFileSync(file, 'utf8')) || [];
  } catch (err) {
    console.error(`Failed to read ${file}:`, err.message);
    return [];
  }
}

function loadJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) || [];
  } catch (err) {
    console.error(`Failed to read ${file}:`, err.message);
    return [];
  }
}

function commitSet(entries) {
  return new Set(
    entries
      .filter(e => e && typeof e.commit === 'string')
      .map(e => e.commit.trim())
      .filter(Boolean)
  );
}

const root = path.join(__dirname, '..');
const yamlPath = path.join(root, 'advancedToDo.yaml');
const jsonPath = path.join(root, 'advancedToDo.json');

const yamlEntries = loadYaml(yamlPath);
const jsonEntries = loadJson(jsonPath);

const yamlCommits = commitSet(yamlEntries);
const jsonCommits = commitSet(jsonEntries);

const missingInYaml = [...jsonCommits].filter(c => !yamlCommits.has(c));
const missingInJson = [...yamlCommits].filter(c => !jsonCommits.has(c));

function sample(arr) {
  const max = 20;
  return arr
    .slice(0, max)
    .map(c => (c.length > 80 ? `${c.slice(0, 77)}...` : c))
    .concat(arr.length > max ? ['…'] : []);
}

if (missingInYaml.length || missingInJson.length) {
  console.error('advancedToDo mismatch detected');
  if (missingInYaml.length) {
    console.error('  Commits missing in YAML:', sample(missingInYaml));
  }
  if (missingInJson.length) {
    console.error('  Commits missing in JSON:', sample(missingInJson));
  }
  process.exit(1);
}

console.log('advancedToDo files are consistent.');
