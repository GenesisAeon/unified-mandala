const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const convFile = path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
const yamlFile = path.join(__dirname, '../advancedToDo.yaml');
const jsonFile = path.join(__dirname, '../advancedToDo.json');

const data = JSON.parse(fs.readFileSync(convFile, 'utf8'));
let block = null;
for (const conv of data) {
  for (const node of Object.values(conv.mapping)) {
    const part = node.message?.content?.parts?.[0]; if(typeof part!=="string") continue;
    if (part && part.includes('advancedToDo.yaml')) {
      const m = part.match(/```yaml[^`]*advancedToDo:[\s\S]*?```/);
      if (m) { block = m[0]; break; }
    }
  }
  if (block) break;
}
if (!block) {
  console.error('No advancedToDo block found');
  process.exit(1);
}
const yamlContent = block.replace(/```yaml\n?|```/g, '');
let parsed;
try {
  parsed = YAML.parse(yamlContent);
} catch (err) {
  console.error('Failed to parse YAML:', err);
  process.exit(1);
}
const newEntries = parsed.advancedToDo || [];
function loadYaml(file){
  if(fs.existsSync(file)) return YAML.parse(fs.readFileSync(file,'utf8'))||[];
  return [];
}
function loadJson(file){
  if(fs.existsSync(file)) return JSON.parse(fs.readFileSync(file,'utf8'))||[];
  return [];
}
function merge(existing, add){
  const commits=new Set(existing.map(e=>e.commit));
  for(const e of add){
    if(!commits.has(e.commit)){existing.push(e);commits.add(e.commit);}
  }
  return existing;
}
const yamlData=merge(loadYaml(yamlFile), JSON.parse(JSON.stringify(newEntries)));
const jsonData=merge(loadJson(jsonFile), JSON.parse(JSON.stringify(newEntries)));
fs.writeFileSync(yamlFile, YAML.stringify(yamlData));
fs.writeFileSync(jsonFile, JSON.stringify(jsonData,null,2));
console.log(`Appended ${newEntries.length} tasks to advancedToDo.`);
