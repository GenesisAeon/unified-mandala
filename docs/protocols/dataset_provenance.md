# Dataset Provenance Protocol

Documenting datasets ensures transparency and traceability across the Mandala project.

## Required Metadata

- **Source**: Original location or creator.
- **License**: SPDX identifier or custom terms.
- **Checksum**: SHA256 hash for each artifact.
- **Dataset Card**: Summary including intent, composition, and limitations.

## Recording Procedure

1. Gather source and licensing information for every dataset.
2. Generate SHA256 hashes and store alongside the files.
3. Create or update a dataset card under `docs/datasets/`.
4. Track all entries in `DatasetRegistry` with version and split details.

## Verification Checklist

- [ ] Source and license recorded
- [ ] Checksums verified
- [ ] Dataset card created
- [ ] Registry entry updated

Following this protocol keeps data lineage auditable and supports ethical reuse.
