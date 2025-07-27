import { describe, it, expect } from 'vitest';
import fs from 'fs';
import yaml from 'js-yaml';

describe('avatarraum_manifest', () => {
  it('parses yaml', () => {
    const content = fs.readFileSync(require.resolve('../avatarraum_manifest.yaml'), 'utf8');
    const data = yaml.load(content) as any;
    expect(Array.isArray(data.features)).toBe(true);
  });
});
