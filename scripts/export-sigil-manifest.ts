import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import yaml from 'js-yaml';

interface Entry { file: string; title: string; }

function loadTitle(file: string): string {
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (file.endsWith('.json')) {
      const data = JSON.parse(content);
      return data.title || path.basename(file);
    }
    const data = yaml.load(content) as any;
    return (data && data.title) || path.basename(file);
  } catch {
    return path.basename(file);
  }
}

function exportManifest(outDir: string) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const files = globSync('docs/sigils/**/*.{yaml,yml,json}');
  const list: Entry[] = files.map(f => ({ file: f, title: loadTitle(f) }));
  fs.writeFileSync(path.join(outDir, 'sigil_manifest.json'), JSON.stringify(list, null, 2));
  fs.writeFileSync(path.join(outDir, 'sigil_manifest.yaml'), yaml.dump(list));
  fs.writeFileSync(path.join(outDir, 'README.md'), '# Sigil Manifest\n\n' + list.map(e => `- ${e.title}: ${e.file}`).join('\n') + '\n');
}

const outDir = process.argv[2] || path.join('docs', 'sigils', 'manifest');
exportManifest(outDir);
