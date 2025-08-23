export interface PersonhoodMetadata {
  subjectId: string;
  consentScope: string;
}

export interface ProvenanceCard {
  sourceUri: string;
  license: string;
  sha256: string;
  personhood?: PersonhoodMetadata;
}

import { sha256 } from '../provenance/Provenance';

export function createProvenanceCard(
  sourceUri: string,
  content: string | Buffer,
  license: string,
  personhood?: PersonhoodMetadata
): ProvenanceCard {
  return {
    sourceUri,
    license,
    sha256: sha256(content),
    personhood,
  };
}
