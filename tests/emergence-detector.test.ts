/* @jest-environment node */
import fs from 'fs';
import yaml from 'js-yaml';

describe('emergence detector configuration', () => {
  it('defines CPT anomaly trigger for antimatter qubit monitor', () => {
    const config = yaml.load(
      fs.readFileSync('config/emergence-detector.yaml', 'utf8')
    ) as any;
    expect(Array.isArray(config.triggers)).toBe(true);
    const cpt = config.triggers.find((t: any) => t.id === 'cpt-anomaly');
    expect(cpt).toBeDefined();
    expect(cpt.source).toBe('antimatter-qubit-monitor');
    expect(cpt.event).toBe('cpt_anomaly_detected');
    expect(cpt.cpt_delta_threshold).toBeGreaterThan(0);
  });
});
