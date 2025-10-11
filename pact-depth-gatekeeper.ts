import { gatekeep, Role } from './pact-depth-rules';

function parseArgs(): { depth: number; role: Role } {
  const args = process.argv.slice(2);
  const depthArg = args.find((a) => a.startsWith('--depth'));
  const roleArg = args.find((a) => a.startsWith('--role'));

  const depth = depthArg ? Number(depthArg.split('=')[1]) : NaN;
  const role = roleArg ? (roleArg.split('=')[1] as Role) : undefined;

  if (isNaN(depth) || !role) {
    console.error(
      'Usage: node pact-depth-gatekeeper.js --depth=<number> --role=<admin|developer|guest>',
    );
    process.exit(1);
  }

  return { depth, role };
}

if (require.main === module) {
  const { depth, role } = parseArgs();
  const result = gatekeep(depth, role);
  console.log(result);
}
