import { extractConvoMemory, ConvoMemory } from './ConvoMemoryBridge';
import { NucleonScanner } from '../crep-engine/NucleonScanner';

export interface CREPAnalysis {
  memory: ConvoMemory;
  averagePhi: number;
}

/**
 * Bridges conversation memory extraction with the CREP engine's
 * NucleonScanner to provide phi-based analysis.
 */
export function analyzeConvoCREP(conversation: string): CREPAnalysis {
  const memory = extractConvoMemory(conversation);
  const scanner = new NucleonScanner();
  scanner.importFromTranscript(conversation);
  return {
    memory,
    averagePhi: scanner.averagePhi(),
  };
}
