import path from 'path';
import { ingestArchive } from './quantum-archive-ingest';
import { QuantumTheoryAgent } from '../packages/agents';

test('ingestArchive feeds entries and triggers anomalies', () => {
  const agent = new QuantumTheoryAgent(0.5);
  const anomalies: any[] = [];
  agent.onAnomaly((m) => anomalies.push(m));
  const count = ingestArchive(
    agent,
    path.join(__dirname, '..', 'docs', 'archive', 'archiv-menschheitsspuren.md'),
  );
  expect(count).toBeGreaterThan(0);
  expect(anomalies.length).toBeGreaterThan(0);
});
