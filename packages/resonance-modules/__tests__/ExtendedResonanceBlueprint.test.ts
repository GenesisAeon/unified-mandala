import { describe, it, expect } from 'vitest';
import { ExtendedResonanceBlueprint, ResonanceBlueprint } from '../ExtendedResonanceBlueprint';
import yaml from 'js-yaml';

describe('ExtendedResonanceBlueprint', () => {
  it('creates YAML blueprint', () => {
    const bp: ResonanceBlueprint = ExtendedResonanceBlueprint.create('svc', ['/a', '/b'], ['latency']);
    const out = ExtendedResonanceBlueprint.toYAML(bp);
    const doc = yaml.load(out) as any;
    expect(doc.service).toBe('svc');
    expect(doc.endpoints).toEqual(['/a', '/b']);
    expect(doc.metrics).toEqual(['latency']);
  });
});
