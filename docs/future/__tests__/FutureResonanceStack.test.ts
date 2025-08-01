import fs from 'fs';
import path from 'path';

describe('FutureResonanceStack blueprint', () => {
  it('exists', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'FutureResonanceStack.md'))).toBe(true);
  });
});
