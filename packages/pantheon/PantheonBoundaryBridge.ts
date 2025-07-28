import { detectBoundary, BoundaryMatch } from '../core/BoundaryRuleDetector';

export type BoundaryEventEmitter = (matches: BoundaryMatch[]) => void;

export class PantheonBoundaryBridge {
  constructor(private emit: BoundaryEventEmitter = () => {}) {}

  bridge(eventText: string, rules: (string | RegExp)[]): BoundaryMatch[] {
    const matches = detectBoundary(rules, eventText);
    if (matches.length) {
      this.emit(matches);
    }
    return matches;
  }
}
