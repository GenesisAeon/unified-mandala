const fs = require('fs');
const yaml = require('yaml');

function loadYaml(file){
  return yaml.parse(fs.readFileSync(file,'utf8'));
}

const items = loadYaml('advancedToDo.yaml');

const categories = {
  Pantheon: [],
  Boundary: [],
  'VR-Begegnungsraum': [],
  'Erweiterte Resonanzmodule': []
};

for(const it of items){
  if(!it || typeof it.commit !== 'string') continue;
  const text = `${it.commit} ${it.path}`;
  const entry = {commit: it.commit, path: it.path, status: it.status};
  if(/pantheon/i.test(text)) categories.Pantheon.push(entry);
  if(/boundary/i.test(text)) categories.Boundary.push(entry);
  if(/vr|avatarraum/i.test(text)) categories['VR-Begegnungsraum'].push(entry);
  if(/resonance|resonanz|fourier/i.test(text)) categories['Erweiterte Resonanzmodule'].push(entry);
}

fs.writeFileSync('advancedToDo/advanced_categories.json', JSON.stringify(categories, null, 2));
fs.writeFileSync('advancedToDo/advanced_categories.yaml', yaml.stringify(categories));
console.log('Categories written to advancedToDo/advanced_categories.*');
