import { describe, expect, it } from 'vitest';

import {
  evaluateMandalaEvents,
  evaluatePolicy,
  evaluatePolicyAgainstResource,
  materializeMandalaResources,
  normalizeEvents,
  PolicyEvent,
  evaluateFromFiles,
} from '../../src/governance/policy-evaluator';

const samplePolicy = {
  spec: {
    rules: [
      {
        name: 'require-personhood-level',
        validate: {
          message: 'High-risk topics require personhood P3',
          pattern: {
            '(topic)': 'governance.override',
            '(personhood)': 'P3',
          },
        },
      },
    ],
  },
};

describe('policy evaluator', () => {
  it('normalizes scalar events into arrays', () => {
    const event: PolicyEvent = { id: 'evt-1' };
    expect(normalizeEvents(event)).toEqual([event]);
  });

  it('materializes Mandala resources with kind metadata', () => {
    const resources = materializeMandalaResources([{ id: 'evt-2', topic: 'governance.override' }]);
    expect(resources).toEqual([
      {
        kind: 'MandalaEvent',
        id: 'evt-2',
        topic: 'governance.override',
      },
    ]);
  });

  it('passes when an event satisfies the personhood guard', () => {
    const summary = evaluateMandalaEvents(samplePolicy, {
      id: 'evt-3',
      topic: 'governance.override',
      personhood: 'P3',
    });
    expect(summary.matched).toBe(1);
    expect(summary.violations).toHaveLength(0);
  });

  it('flags violations when the personhood requirement is missed', () => {
    const violations = evaluatePolicyAgainstResource(samplePolicy, {
      kind: 'MandalaEvent',
      topic: 'governance.override',
      personhood: 'P1',
    });
    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      rule: 'require-personhood-level',
      message: 'High-risk topics require personhood P3',
    });
    expect(violations[0].mismatches[0]).toMatchObject({
      key: 'personhood',
      expected: 'P3',
      actual: 'P1',
    });
  });

  it('evaluates the repository policy and fixture without violations', () => {
    const evaluation = evaluateFromFiles(
      'policies/kyverno.yaml',
      'fixtures/events/example_input.json',
    );
    expect(evaluation.violations).toHaveLength(0);
    expect(evaluation.matched).toBeGreaterThan(0);
  });

  it('aggregates violations over multiple resources', () => {
    const evaluation = evaluatePolicy(samplePolicy, [
      { kind: 'MandalaEvent', topic: 'governance.override', personhood: 'P1' },
      { kind: 'MandalaEvent', topic: 'governance.override', personhood: 'P2' },
    ]);
    expect(evaluation.violations).toHaveLength(2);
    expect(evaluation.matched).toBe(0);
  });
});
