#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';

/**
 * Splits a large newadvancedconversations.json file into per-conversation
 * folders without loading the entire dataset into memory.
 *
 * Each conversation is written to `<dest>/<slug>/conversation.json`.
 *
 * @param src Path to the source JSON array file.
 * @param dest Destination directory for conversation fragments.
 * @returns Number of conversations processed.
 */
export function split(src: string, dest: string): Promise<number> {
  return new Promise((resolve, reject) => {
    let count = 0;
    fs.mkdirSync(dest, { recursive: true });

    const pipeline = fs
      .createReadStream(src, { encoding: 'utf8' })
      .pipe(parser())
      .pipe(streamArray());

    pipeline.on('data', ({ value }: { value: any }) => {
      const slug = (value.title || String(count))
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `${count}`;
      const dir = path.join(dest, slug);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'conversation.json'), JSON.stringify(value, null, 2));
      count++;
    });

    pipeline.on('end', () => {
      console.log(`Split ${count} conversations to ${dest}`);
      resolve(count);
    });

    pipeline.on('error', reject);
  });
}

if (require.main === module) {
  const srcArg =
    process.argv[2] || path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
  const destArg =
    process.argv[3] || path.join(__dirname, '../GenesisAeonZIPMEM/newadvancedconversations');
  split(srcArg, destArg).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
