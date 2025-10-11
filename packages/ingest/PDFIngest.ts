import fs from 'fs';
import pdfParse from 'pdf-parse';
import { createProvenanceCard, PersonhoodMetadata, ProvenanceCard } from './ProvenanceCard';

export interface PDFIngestResult {
  text: string;
  provenance: ProvenanceCard;
}

export async function ingestPDF(
  filePath: string,
  license: string,
  personhood?: PersonhoodMetadata,
): Promise<PDFIngestResult> {
  const data = fs.readFileSync(filePath);
  (pdfParse as any).pdfjs.GlobalWorkerOptions.workerSrc = undefined;
  const parsed = await pdfParse(data);
  const provenance = createProvenanceCard(filePath, data, license, personhood);
  return { text: parsed.text, provenance };
}
