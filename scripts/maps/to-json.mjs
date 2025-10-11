import fs from 'fs';
import { parse } from 'yaml';
import path from 'path';

const maps = ['RepoMap', 'ProgramFlow'];
for (const name of maps) {
  const yamlPath = `docs/maps/${name}.yaml`;
  const jsonPath = `docs/maps/${name}.json`;
  const data = parse(fs.readFileSync(yamlPath, 'utf8'));
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  console.log(`wrote ${jsonPath}`);
}
