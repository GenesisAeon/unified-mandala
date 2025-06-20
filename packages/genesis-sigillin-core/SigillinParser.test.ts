/** @jest-environment node */
import { gzipSync } from 'zlib';
import YAML from 'yaml';
import { SigillinParser } from './SigillinParser';
import { generateSigillinMetaSignatur } from './SigillinMetaSignatur';

describe('SigillinParser', () => {
  it('parses YAML header from zipped buffer and returns signature', () => {
    const header = { id: 'a1', type: 'poetic-root', status: 'draft' };
    const yamlStr = YAML.stringify(header);
    const zipped = gzipSync(Buffer.from(yamlStr, 'utf-8'));

    const { header: parsed, signature } = SigillinParser(zipped);
    expect(parsed).toEqual(header);
    expect(signature).toBe(generateSigillinMetaSignatur(header));
  });
});
