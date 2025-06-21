import { execSync } from 'child_process';

export function autoDocGeneration(entry: string, outDir: string): void {
  const cmd = `npx typedoc ${entry} --out ${outDir}`;
  execSync(cmd, { stdio: 'inherit' });
}
