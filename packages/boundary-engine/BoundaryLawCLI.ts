import { BoundaryLawDiscoveryEngine } from './BoundaryLawDiscoveryEngine';

export function runBoundaryLawCLI(args: string[]) {
  const engine = new BoundaryLawDiscoveryEngine();
  if (args.includes('--scan')) {
    console.log('Scanning boundaries');
    engine.scan();
  }
}

if (require.main === module) {
  runBoundaryLawCLI(process.argv.slice(2));
}
