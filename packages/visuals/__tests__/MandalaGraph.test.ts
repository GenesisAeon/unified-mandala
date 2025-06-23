import { loadMasterCanvas } from '../MandalaGraph';
import fs from 'fs';
import path from 'path';

test('loads nodes from yaml', () => {
  const tmp = path.join(__dirname, 'temp.yaml');
  fs.writeFileSync(tmp, 'nodes:\n  - id: a\n    label: A\nedges: []');
  const { nodes } = loadMasterCanvas(tmp);
  expect(nodes[0].id).toBe('a');
  fs.unlinkSync(tmp);
});
