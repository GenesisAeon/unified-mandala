import fs from 'fs';
import path from 'path';
import { QuantumTheoryAgent } from '../packages/agents';

/**
 * Reads the archiv-menschheitsspuren dataset and feeds each entry
 * into a QuantumTheoryAgent instance. Each line length is mapped
 * to a CPT delta so anomalies can be detected.
 *
 * @param agent QuantumTheoryAgent instance to record measurements with.
 * @param archiveFile optional path to the archive markdown file
 * @returns number of processed entries
 */
export function ingestArchive(
  agent: QuantumTheoryAgent,
  archiveFile: string = path.join(__dirname, '..', 'docs', 'archive', 'archiv-menschheitsspuren.md'),
): number {
  const content = fs.readFileSync(archiveFile, 'utf-8');
  const lines = content.split(/\r?\n/).filter((l) => l.trim().startsWith('-'));
  for (const line of lines) {
    const cptDelta = line.length / 100;
    agent.observe({ cptDelta, timestamp: Date.now() });
  }
  return lines.length;
}

if (require.main === module) {
  const agent = new QuantumTheoryAgent();
  agent.onAnomaly((m) => {
    console.log('Anomaly detected', m);
  });
  const count = ingestArchive(agent);
  console.log(`Processed ${count} archive entries`);
}
