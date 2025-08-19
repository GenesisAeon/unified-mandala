import { DatasetRegistry } from '../packages/datasets/DatasetRegistry';
import { ConsentRegistry } from '../packages/personhood/ConsentRegistry';

describe('DatasetRegistry', () => {
  const personId = 'tester';

  beforeEach(() => {
    // reset consent and registry
    (ConsentRegistry as any).consentMap = new Map();
    (DatasetRegistry as any).datasets = new Map();
  });

  it('requires consent to register dataset', () => {
    expect(() => DatasetRegistry.registerDataset('sample', personId)).toThrow(
      /Consent required/
    );
  });

  it('registers dataset versions, splits and artifacts with consent', () => {
    ConsentRegistry.grant(personId);
    DatasetRegistry.registerDataset('sample', personId);
    DatasetRegistry.addVersion('sample', 'v1', personId);
    DatasetRegistry.addSplit('sample', 'v1', 'train', '/train.txt', personId);
    DatasetRegistry.addArtifact('sample', 'v1', 'card', '/card.md', personId);

    const dataset = DatasetRegistry.getDataset('sample');
    expect(dataset).toBeDefined();
    const version = DatasetRegistry.getVersion('sample', 'v1');
    expect(version.splits.train).toBe('/train.txt');
    expect(version.artifacts.card).toBe('/card.md');
  });
});
