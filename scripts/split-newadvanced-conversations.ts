#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export function splitNewAdvancedConversations(
  srcPath: string,
  outDir: string
): string[] {
  const data = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  if (!Array.isArray(data)) {
    throw new Error('Expected an array of conversations');
  }
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  return data.map((conv: any, idx: number) => {
    const base = path.join(outDir, `conversation-${idx + 1}`);
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
  const files = splitNewAdvancedConversations(src, out);
  console.log(`Wrote ${files.length} fragments to ${out}`);
}
