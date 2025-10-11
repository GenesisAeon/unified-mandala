#!/usr/bin/env ts-node
import { FourierLayer } from '../analysis/FourierLayer';

function parseArgs(): number[] {
  const input = process.argv.slice(2);
  if (input.length === 0) {
    console.error('Usage: FourierMetricsCLI <num1,num2,...>');
    process.exit(1);
  }
  return input[0].split(',').map(Number);
}

function main() {
  const data = parseArgs();
  const layer = new FourierLayer('cli', 1, data, { depth: data.length });
  const result = layer.analyze();
  const out = {
    maxAmplitude: result.metrics.maxAmplitude,
    avgAmplitude: result.metrics.avgAmplitude,
  };
  console.log(JSON.stringify(out, null, 2));
}

main();
