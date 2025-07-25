import { BoundaryLawDiscovery, BoundaryRule } from './BoundaryLawDiscovery';

export class BoundaryLawDiscoveryEngine {
  constructor(private discovery: BoundaryLawDiscovery = new BoundaryLawDiscovery()) {}

  analyze(rules: BoundaryRule[]): string[] {
    return this.discovery.discover(rules);
  }
}
