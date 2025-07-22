import { detectBoundary, BoundaryMatch } from '../core/BoundaryRuleDetector';

export class PantheonBoundaryBridge {
  bridge(eventText: string, rules: (string | RegExp)[]): BoundaryMatch[] {
    return detectBoundary(rules, eventText);
  }
}
