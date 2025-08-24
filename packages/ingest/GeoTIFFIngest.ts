import fs from 'fs';
import { fromArrayBuffer } from 'geotiff';
import { createProvenanceCard, PersonhoodMetadata, ProvenanceCard } from './ProvenanceCard';

export interface GeoTIFFIngestResult {
  metadata: Record<string, unknown>;
  provenance: ProvenanceCard;
}

export async function ingestGeoTIFF(
  filePath: string,
  license: string,
  personhood?: PersonhoodMetadata
): Promise<GeoTIFFIngestResult> {
  const data = fs.readFileSync(filePath);
  const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  const tiff = await fromArrayBuffer(arrayBuffer);
  const image = await tiff.getImage();
  const metadata = {
    width: image.getWidth(),
    height: image.getHeight(),
    resolution: image.getResolution(),
    bbox: image.getBoundingBox(),
  };
  const provenance = createProvenanceCard(filePath, data, license, personhood);
  return { metadata, provenance };
}
