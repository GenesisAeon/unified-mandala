import type { BoundaryObservation } from '@mandala/boundary-core';
import BoundaryRegistry from '@mandala/boundary-core';
import Extractor, { type ExtractInput } from './extractor';

export class DiscoveryEngine {
  constructor(
    private registry: BoundaryRegistry = new BoundaryRegistry(),
    private extractor: Extractor = new Extractor(),
  ) {}

  loadRules(rules: Parameters<BoundaryRegistry['registerMany']>[0]) {
    this.registry.registerMany(rules);
  }

  async run(inputs: ExtractInput) {
    const rules = this.registry.list();
    const observations = this.extractor.run(rules, inputs);
    const violations = observations.filter((o) => o.verdict === 'violation');
    return {
      rulesCount: rules.length,
      observationsCount: observations.length,
      violationsCount: violations.length,
      observations: observations as BoundaryObservation[],
      summary: {
        ok: observations.length - violations.length,
        warn: violations.filter((v) => v.severity === 'warn').length,
        error: violations.filter((v) => v.severity === 'error').length,
      },
    };
  }
}

export default DiscoveryEngine;
