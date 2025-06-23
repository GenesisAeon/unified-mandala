const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
let analyzeRepo;
try {
  ({ analyzeRepo } = require('../dist/shared-utils/selfAnalyzer.js'));
} catch {
  ({ analyzeRepo } = require('../packages/shared-utils/selfAnalyzer'));
}

function appendTasks(entries, yamlFile, jsonFile) {
  const loadYaml = (f) => (fs.existsSync(f) ? YAML.parse(fs.readFileSync(f, 'utf8')) : []);
  const loadJson = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : []);
  const merge = (existing, add) => {
    const known = new Set(existing.map((e) => e.commit));
    for (const e of add) {
      if (!known.has(e.commit)) {
        existing.push(e);
        known.add(e.commit);
      }
    }
    return existing;
  };
  const y = merge(loadYaml(yamlFile), entries);
  const j = merge(loadJson(jsonFile), entries);
  fs.writeFileSync(yamlFile, YAML.stringify(y, null, 2));
  fs.writeFileSync(jsonFile, JSON.stringify(j, null, 2));
}

function generateTodoFromRepo(yamlFile = path.join(__dirname, '../advancedToDo.yaml'), jsonFile = path.join(__dirname, '../advancedToDo.json')) {
  const stats = analyzeRepo();
  const entries = stats.packages.map((pkg) => ({
    commit: `Add tests for ${pkg}`,
    path: `packages/${pkg}`,
    task: `Ensure unit tests exist for ${pkg}`,
    test: `packages/${pkg}/*.test.ts`
  }));
  appendTasks(entries, yamlFile, jsonFile);
  console.log(`todo entries updated for ${entries.length} packages`);
  return entries;
}

if (require.main === module) {
  generateTodoFromRepo();
}

module.exports = { generateTodoFromRepo };
