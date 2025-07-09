import { execSync } from 'child_process';
import path from 'path';

describe('FourierMetricsCLI', () => {
  it('prints metrics for sample data', () => {
    const cli = path.resolve(__dirname, 'FourierMetricsCLI.ts');
    const output = execSync(`ts-node ${cli} 1,0,-1,0`).toString();
    const json = JSON.parse(output);
    expect(json.maxAmplitude).toBeGreaterThan(0);
    expect(json.avgAmplitude).toBeGreaterThan(0);
  });
});
