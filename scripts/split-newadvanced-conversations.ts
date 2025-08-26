#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export function splitNewAdvancedConversations(
  srcPath: string,
  outDir: string,
  start = 0,
  count = Infinity
): string[] {
  const data = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  if (!Array.isArray(data)) {
    throw new Error('Expected an array of conversations');
  }
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  return data.slice(start, start + count).map((conv: any, idx: number) => {
    const index = start + idx + 1;
    const base = path.join(outDir, `conversation-${index}`);
    const jsonFile = `${base}.json`;
    const yamlFile = `${base}.yaml`;
    fs.writeFileSync(jsonFile, JSON.stringify(conv, null, 2));
    fs.writeFileSync(yamlFile, yaml.dump(conv));
    return jsonFile;
  });
}

if (require.main === module) {
  const src =
    process.argv[2] ||
    path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
  const out =
    process.argv[3] ||
    path.join(__dirname, '../docs/sigils/newadvancedconversations_fragments');
  const start = parseInt(process.argv[4] || '0', 10);
  const count = parseInt(process.argv[5] || `${Number.POSITIVE_INFINITY}`, 10);
  const files = splitNewAdvancedConversations(src, out, start, count);
  console.log(`Wrote ${files.length} fragments to ${out}`);
}
