import path from 'path';
import { ingestPDF } from '../packages/ingest/PDFIngest';
import { ingestGeoTIFF } from '../packages/ingest/GeoTIFFIngest';
import { ingestVCF } from '../packages/ingest/VCFIngest';
import { ConsentRegistry } from '../packages/personhood/ConsentRegistry';
import { requireConsent } from '../packages/personhood/PolicyGuard';
import { AuditTrail } from '../packages/personhood/AuditTrail';

async function run() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: ts-node ingest-demo.ts <file>');
    process.exit(1);
  }

  const ext = path.extname(file).toLowerCase();
  const personId = process.env.PERSON_ID || 'demo-subject';
  const license = process.env.LICENSE || 'CC-BY';

  // grant consent and enforce personhood gate
  ConsentRegistry.grant(personId);
  requireConsent(personId);

  try {
    let provenance;
    if (ext === '.pdf') {
      const res = await ingestPDF(file, license, {
        subjectId: personId,
        consentScope: 'research',
      });
      provenance = res.provenance;
      console.log(`Extracted PDF with ${res.text.length} chars`);
    } else if (ext === '.tif' || ext === '.tiff') {
      const res = await ingestGeoTIFF(file, license, {
        subjectId: personId,
        consentScope: 'research',
      });
      provenance = res.provenance;
      console.log('Extracted GeoTIFF metadata', res.metadata);
    } else if (ext === '.vcf') {
      const res = ingestVCF(file, license, {
        subjectId: personId,
        consentScope: 'research',
      });
      provenance = res.provenance;
      console.log(`Parsed ${res.variants.length} VCF variants`);
    } else {
      throw new Error(`Unsupported file type: ${ext}`);
    }

    AuditTrail.record({ personId, action: 'ingest_demo', source: path.resolve(file) });
    console.log('Provenance card', provenance);
  } catch (err) {
    AuditTrail.record({ personId, action: 'ingest_demo_error', message: (err as Error).message });
    console.error('Ingest failed:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  run();
}
