#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

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
    const file = path.join(outDir, `conversation-${idx + 1}.json`);
    fs.writeFileSync(file, JSON.stringify(conv, null, 2));
    return file;
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
