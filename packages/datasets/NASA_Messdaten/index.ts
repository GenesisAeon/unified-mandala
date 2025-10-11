import { DatasetRegistry } from '../DatasetRegistry';

export const NASA_DATASET_NAME = 'NASA_Messdaten';
export const NASA_DATASET_VERSION = 'v1';

export function registerNASAMessdaten(personId: string): void {
  DatasetRegistry.registerDataset(NASA_DATASET_NAME, personId);
  DatasetRegistry.addVersion(NASA_DATASET_NAME, NASA_DATASET_VERSION, personId);
  DatasetRegistry.addSplit(
    NASA_DATASET_NAME,
    NASA_DATASET_VERSION,
    'train',
    '/data/nasa/train.csv',
    personId,
  );
  DatasetRegistry.addSplit(
    NASA_DATASET_NAME,
    NASA_DATASET_VERSION,
    'test',
    '/data/nasa/test.csv',
    personId,
  );
}
