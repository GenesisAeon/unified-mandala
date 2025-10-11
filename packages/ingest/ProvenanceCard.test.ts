import { createProvenanceCard } from './ProvenanceCard';
import { sha256 } from '../provenance/Provenance';

test('creates provenance card with hash and personhood', () => {
  const card = createProvenanceCard('https://example.com/data.txt', 'hello', 'CC-BY-4.0', {
    subjectId: 'user1',
    consentScope: 'research',
  });
  expect(card).toEqual({
    sourceUri: 'https://example.com/data.txt',
    license: 'CC-BY-4.0',
    sha256: sha256('hello'),
    personhood: { subjectId: 'user1', consentScope: 'research' },
  });
});
