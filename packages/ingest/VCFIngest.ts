import fs from 'fs';
import { createProvenanceCard, PersonhoodMetadata, ProvenanceCard } from './ProvenanceCard';

export interface VCFVariant {
  chrom: string;
  pos: number;
  id: string;
  ref: string;
  alt: string;
  qual: string;
  filter: string;
  info: string;
}

export interface VCFIngestResult {
  variants: VCFVariant[];
  provenance: ProvenanceCard;
}

export function ingestVCF(
  filePath: string,
  license: string,
  personhood?: PersonhoodMetadata
): VCFIngestResult {
  const text = fs.readFileSync(filePath, 'utf-8');
  const variants: VCFVariant[] = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue;
    const [chrom, pos, id, ref, alt, qual, filter, info] = line.split('\t');
    variants.push({
      chrom,
      pos: Number(pos),
      id,
      ref,
      alt,
      qual,
      filter,
      info: info ?? '',
    });
  }
  const provenance = createProvenanceCard(filePath, text, license, personhood);
  return { variants, provenance };
}
