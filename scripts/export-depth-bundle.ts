import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

interface BundleEntry {
  file: string;
  content: string;
}

function exportDepthBundle(outDir: string) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const sigilFiles = globSync('docs/sigils/**/*.{yaml,yml,json,sigil.json}');
  const bundle: BundleEntry[] = sigilFiles.map((f) => ({
    file: f,
    content: fs.readFileSync(f, 'utf8'),
  }));
  const bundlePath = path.join(outDir, 'sigillin_depth_bundle.sigil.json');
  fs.writeFileSync(bundlePath, JSON.stringify(bundle, null, 2));
  const indexPath = path.join(outDir, 'depth_index.md');
  const indexLines = bundle.map((b) => `- ${b.file}`).join('\n');
  fs.writeFileSync(indexPath, '# Depth Bundle Index\n' + indexLines + '\n');
  console.log(`Bundle written to ${bundlePath}`);
  console.log(`Index written to ${indexPath}`);
}

const outDir = process.argv[2] || 'exports';
exportDepthBundle(outDir);
