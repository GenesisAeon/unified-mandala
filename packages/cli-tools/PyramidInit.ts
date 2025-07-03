import fs from 'fs';
import path from 'path';
import { PyramidConfig } from '../unifiedmandala-ui/pyramid/PyramidConfig';

export function createDefaultPyramidConfig(output = 'pyramid.config.json'): void {
  const config: PyramidConfig = {
    layers: [
      { name: 'base', weight: 1, color: '#FFD700' },
      { name: 'middle', weight: 0.618, color: '#FF8C00' },
      { name: 'apex', weight: 0.382, color: '#FF4500' }
    ]
  };
  fs.writeFileSync(path.resolve(output), JSON.stringify(config, null, 2));
}

if (require.main === module) {
  const [, , file] = process.argv;
  createDefaultPyramidConfig(file);
  console.log('Created', file || 'pyramid.config.json');
}
