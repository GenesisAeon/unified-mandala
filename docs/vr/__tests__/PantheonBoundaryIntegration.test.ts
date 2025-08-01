import fs from 'fs';
import path from 'path';

describe('PantheonBoundaryIntegration blueprint', () => {
  it('exists', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'PantheonBoundaryIntegration.md'))).toBe(true);
  });
});
