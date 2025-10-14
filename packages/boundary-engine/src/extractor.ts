import type { BoundaryObservation, BoundaryRule } from '@mandala/boundary-core';

export type ExtractInput = { source: string; content: string }[];

export class Extractor {
  run(rules: BoundaryRule[], inputs: ExtractInput): BoundaryObservation[] {
    const out: BoundaryObservation[] = [];
    const now = () => new Date().toISOString();
    for (const inp of inputs) {
      for (const r of rules) {
        if (!r.pattern) continue;
        let verdict: BoundaryObservation['verdict'] = 'pass';
        const rx = new RegExp(r.pattern, 'i');
        if (rx.test(inp.content)) verdict = 'violation';
        out.push({
          ts: now(),
          source: inp.source,
          ruleId: r.id,
          verdict,
          details: verdict === 'violation' ? `Matched pattern: ${r.pattern}` : 'No match',
          severity: r.severity ?? 'info',
        });
      }
    }
    return out;
  }
}

export default Extractor;
