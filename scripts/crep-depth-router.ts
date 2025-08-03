export type DepthRoute = 'shallow' | 'medium' | 'deep';

/**
 * Routes a process path based on a numeric depth value.
 * @param depth The CREP depth factor
 * @returns route identifier describing depth band
 */
export function routeByDepth(depth: number): DepthRoute {
  if (depth < 10) return 'shallow';
  if (depth < 20) return 'medium';
  return 'deep';
}

if (require.main === module) {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: crep-depth-router <depth>');
    process.exit(1);
  }
  const depth = Number(arg);
  if (isNaN(depth)) {
    console.error('Depth must be numeric');
    process.exit(1);
  }
  const route = routeByDepth(depth);
  console.log(route);
}
