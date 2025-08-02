import { analyzePackages, suggestFixes, PackageReport } from './deep-repo-analysis';
import { mkdtempSync, writeFileSync, mkdirSync } from 'fs';
import os from 'os';
import path from 'path';

describe('analyzePackages', () => {
  it('detects risky dependencies', () => {
    const tmp = mkdtempSync(path.join(os.tmpdir(), 'repo-'));
    const packagesDir = path.join(tmp, 'packages', 'demo');
    mkdirSync(packagesDir, { recursive: true });
    writeFileSync(
      path.join(packagesDir, 'package.json'),
      JSON.stringify({ name: 'demo', dependencies: { safe: '1.0.0', risky: '*' } })
    );
    const reports = analyzePackages(tmp);
    expect(reports).toEqual([{ name: 'demo', dependencies: 2, risky: ['risky'] }]);
  });
});

describe('suggestFixes', () => {
  it('uses agent when risky deps exist', async () => {
    const agent = { createSnippet: jest.fn().mockResolvedValue('fix') };
    const report: PackageReport = { name: 'demo', dependencies: 1, risky: ['risky'] };
    const res = await suggestFixes(agent, report);
    expect(agent.createSnippet).toHaveBeenCalled();
    expect(res).toBe('fix');
  });

  it('skips agent when no risks', async () => {
    const agent = { createSnippet: jest.fn() };
    const report: PackageReport = { name: 'demo', dependencies: 0, risky: [] };
    const res = await suggestFixes(agent, report);
    expect(agent.createSnippet).not.toHaveBeenCalled();
    expect(res).toBeNull();
  });
});
