import type { BoundaryObservation, BoundaryRule } from '@mandala/boundary-core';
import { stableBoundaryEventKey } from '@mandala/boundary-core';

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
        const observation: BoundaryObservation = {
          ts: now(),
          source: inp.source,
          ruleId: r.id,
          verdict,
          details: verdict === 'violation' ? `Matched pattern: ${r.pattern}` : 'No match',
          severity: r.severity ?? 'info',
          eventKey: '',
        };
        observation.eventKey = stableBoundaryEventKey({
          ruleId: observation.ruleId,
          source: observation.source,
          ts: observation.ts,
          verdict: observation.verdict,
          severity: observation.severity,
          details: observation.details,
        });
        out.push(observation);
      }
    }
    return out;
  }
}

export default Extractor;
