import { requireConsent } from '../personhood/PolicyGuard';

export interface DatasetVersion {
  version: string;
  splits: Record<string, string>;
  artifacts: Record<string, string>;
}

export interface DatasetRecord {
  name: string;
  versions: Map<string, DatasetVersion>;
}

/**
 * DatasetRegistry keeps track of datasets, their versions,
 * splits and artifacts. All operations require personhood consent.
 */
export class DatasetRegistry {
  private static datasets = new Map<string, DatasetRecord>();

  static registerDataset(name: string, personId: string): void {
    requireConsent(personId);
    if (!this.datasets.has(name)) {
      this.datasets.set(name, { name, versions: new Map() });
    }
  }

  static addVersion(name: string, version: string, personId: string): void {
    requireConsent(personId);
    const record = this.datasets.get(name);
    if (!record) throw new Error(`Unknown dataset: ${name}`);
    if (!record.versions.has(version)) {
      record.versions.set(version, { version, splits: {}, artifacts: {} });
    }
  }

  static addSplit(
    name: string,
    version: string,
    splitName: string,
    uri: string,
    personId: string
  ): void {
    requireConsent(personId);
    const ver = this.getVersion(name, version);
    ver.splits[splitName] = uri;
  }

  static addArtifact(
    name: string,
    version: string,
    artifactName: string,
    uri: string,
    personId: string
  ): void {
    requireConsent(personId);
    const ver = this.getVersion(name, version);
    ver.artifacts[artifactName] = uri;
  }

  static getDataset(name: string): DatasetRecord | undefined {
    return this.datasets.get(name);
  }

  static getVersion(name: string, version: string): DatasetVersion {
    const record = this.datasets.get(name);
    if (!record) throw new Error(`Unknown dataset: ${name}`);
    const ver = record.versions.get(version);
    if (!ver) throw new Error(`Unknown version: ${version}`);
    return ver;
  }
}
