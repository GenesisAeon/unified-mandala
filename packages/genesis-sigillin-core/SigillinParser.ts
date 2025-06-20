import { unzipSync } from 'zlib';
import YAML from 'yaml';
import { generateSigillinMetaSignatur } from './SigillinMetaSignatur';

export interface ParsedSigillin {
  header: any;
  signature: string;
}

/**
 * Parses a compressed YAML buffer and returns the header object and its signature.
 */
export function SigillinParser(zipBuffer: Buffer): ParsedSigillin {
  const yamlContent = unzipSync(zipBuffer).toString('utf-8');
  const header = YAML.parse(yamlContent);
  const signature = generateSigillinMetaSignatur(header);
  return { header, signature };
}
