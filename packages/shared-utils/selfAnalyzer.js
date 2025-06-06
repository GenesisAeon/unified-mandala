const fs = require('fs');
const path = require('path');
function countFiles(dir) {
  let count = 0;
  if (!fs.existsSync(dir)) return 0;
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) count += countFiles(p);
    else count += 1;
  }
  return count;
}
function analyzeRepo(rootDir = path.resolve(__dirname, '../../')) {
  const packagesDir = path.join(rootDir, 'packages');
  const packages = fs.existsSync(packagesDir)
    ? fs.readdirSync(packagesDir).filter(d => fs.statSync(path.join(packagesDir, d)).isDirectory())
    : [];
  const docsDir = path.join(rootDir, 'docs');
  const docFiles = countFiles(docsDir);
  const testFiles = packages.reduce((acc, pkg) => {
    const pkgDir = path.join(packagesDir, pkg);
    if (!fs.existsSync(pkgDir)) return acc;
    const files = fs.readdirSync(pkgDir);
    const tests = files.filter(f => f.includes('.test.')).length;
    return acc + tests;
  }, 0);
  return { packages, docFiles, testFiles };
}
function printRepoStats(stats) {
  console.log(`Packages: ${stats.packages.length}`);
  console.log(`Doc files: ${stats.docFiles}`);
  console.log(`Test files: ${stats.testFiles}`);
}
module.exports = { analyzeRepo, printRepoStats };
