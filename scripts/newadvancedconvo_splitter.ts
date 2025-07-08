#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

export function split(src: string, dest: string): number {
  const data = JSON.parse(fs.readFileSync(src, 'utf8'));
  data.forEach((c: any, i: number) => {
    const slug = (c.title || String(i)).replace(/[^a-zA-Z0-9]+/g, '-');
    const dir = path.join(dest, slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'conversation.json'), JSON.stringify(c, null, 2));
  });
  console.log(`Split ${data.length} conversations to ${dest}`);
  return data.length;
}

if (require.main === module) {
  const srcArg = process.argv[2] || path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
  const destArg = process.argv[3] || path.join(__dirname, '../GenesisAeonZIPMEM/newadvancedconversations');
  split(srcArg, destArg);
}
