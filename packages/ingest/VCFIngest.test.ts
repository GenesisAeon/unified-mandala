import fs from 'fs';
import { ingestVCF } from './VCFIngest';

const sample = `##fileformat=VCFv4.2
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
1\t10177\trs367896724\tA\tAC\t100\tPASS\tDP=100`;

test('parses VCF variants and creates provenance', () => {
  const file = 'packages/ingest/__tmp.vcf';
  fs.writeFileSync(file, sample);
  const result = ingestVCF(file, 'CC-BY-4.0');
  expect(result.variants).toEqual([
    {
      chrom: '1',
      pos: 10177,
      id: 'rs367896724',
      ref: 'A',
      alt: 'AC',
      qual: '100',
      filter: 'PASS',
      info: 'DP=100',
    },
  ]);
  expect(result.provenance.sourceUri).toBe(file);
  fs.unlinkSync(file);
});
