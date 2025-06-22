import fs from 'fs';
import path from 'path';
import { MemoryMesh } from './index';

const file = path.join(__dirname, '../../packages/crep-engine/memoryMesh.berlin.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const mesh = new MemoryMesh();
for (const msg of data.conversations) {
  mesh.process('Europe/Berlin', msg);
}
const { reflection } = mesh.process('Europe/Berlin', 'Willkommen');
data.conversations = mesh.history('Europe/Berlin');
fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log(reflection);
