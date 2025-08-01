import fs from 'fs';
import path from 'path';

describe('MandalaKIPantheonBlueprint', () => {
  it('exists', () => {
    const p = path.join(__dirname, '..', 'MandalaKIPantheonBlueprint.yaml');
    expect(fs.existsSync(p)).toBe(true);
  });
});
