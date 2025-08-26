import { ConsentRegistry } from '../../personhood/ConsentRegistry';
import { DatasetRegistry } from '../DatasetRegistry';
import { registerNASAMessdaten, NASA_DATASET_NAME, NASA_DATASET_VERSION } from '../NASA_Messdaten';

describe('NASA_Messdaten dataset integration', () => {
  const personId = 'tester';

  beforeEach(() => {
    (ConsentRegistry as any).consentMap = new Map();
    (DatasetRegistry as any).datasets = new Map();
  });

  it('registers dataset, version and splits when consent granted', () => {
    ConsentRegistry.grant(personId);
    registerNASAMessdaten(personId);
    const ds = DatasetRegistry.getDataset(NASA_DATASET_NAME);
    expect(ds).toBeDefined();
    const version = DatasetRegistry.getVersion(NASA_DATASET_NAME, NASA_DATASET_VERSION);
    expect(version.splits.train).toBe('/data/nasa/train.csv');
    expect(version.splits.test).toBe('/data/nasa/test.csv');
  });
});
