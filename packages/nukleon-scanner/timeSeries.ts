import { NucleonScanner } from '../crep-engine/NucleonScanner';

/**
 * Simulate CREP development over multiple transcript steps.
 * For each transcript, the average phi across all processed
 * values is appended to the resulting time series.
 */
export function simulateTimeSeries(transcripts: string[]): number[] {
  const scanner = new NucleonScanner();
  const series: number[] = [];
  for (const transcript of transcripts) {
    scanner.importFromTranscript(transcript);
    series.push(scanner.averagePhi());
  }
  return series;
}

export default simulateTimeSeries;
