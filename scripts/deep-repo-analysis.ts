import { readdirSync, readFileSync, existsSync } from 'fs';
import path from 'path';
import { MistralCodeAgent } from '../packages/agents/mistral-code-agent';
import { MistralAPI } from '../packages/agents/mistral-api-agent';

export interface PackageReport {
  name: string;
  dependencies: number;
  risky: string[];
}

export function analyzePackages(baseDir: string): PackageReport[] {
  const packagesDir = path.join(baseDir, 'packages');
  const dirs = readdirSync(packagesDir, { withFileTypes: true }).filter(d => d.isDirectory());
  const reports: PackageReport[] = [];
  for (const dir of dirs) {
    const pkgPath = path.join(packagesDir, dir.name, 'package.json');
    if (!existsSync(pkgPath)) continue;
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    const deps = Object.entries(pkg.dependencies ?? {});
    const risky = deps.filter(([, ver]) => ver === '*' || ver === 'latest').map(([dep]) => dep);
    reports.push({ name: pkg.name ?? dir.name, dependencies: deps.length, risky });
  }
  return reports;
}

export async function suggestFixes(agent: { createSnippet(prompt: string): Promise<string> }, report: PackageReport): Promise<string | null> {
  if (!report.risky.length) return null;
  const prompt = `Package ${report.name} has risky dependencies: ${report.risky.join(', ')}. Provide mitigation steps.`;
  return agent.createSnippet(prompt);
}

if (require.main === module) {
  const reports = analyzePackages(process.cwd());
  if (process.env.MISTRAL_API_KEY) {
    const api = new MistralAPI(process.env.MISTRAL_API_URL || "https://api.mistral.ai", process.env.MISTRAL_API_KEY!);
    const agent = new MistralCodeAgent(api);
    Promise.all(
      reports.map(async r => ({ ...r, suggestion: await suggestFixes(agent, r) }))
    ).then(res => console.log(JSON.stringify(res, null, 2)));
  } else {
    console.log(JSON.stringify(reports, null, 2));
  }
}
