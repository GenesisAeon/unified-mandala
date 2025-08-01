import fs from 'fs';
import path from 'path';

describe('GenesisInterfaceMasterplan blueprint', () => {
  it('exists', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'GenesisInterfaceMasterplan.md'))).toBe(true);
  });
});
