#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import StreamJson from 'stream-json';
import StreamArray from 'stream-json/streamers/StreamArray.js';

const { parser } = StreamJson;
const { streamArray } = StreamArray;

export async function splitNewAdvancedConversations(
  srcPath: string,
  outDir: string,
  start = 0,
  count = Infinity,
  opts: { stream?: boolean } = {}
): Promise<string[]> {
  let useStream = opts.stream;
  if (useStream === undefined) {
    try {
      const size = fs.statSync(srcPath).size;
      useStream = size > 10 * 1024 * 1024; // default to stream for files >10MB
    } catch {
      useStream = false;
    }
  }

  if (!useStream) {
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

  return new Promise((resolve, reject) => {
    const files: string[] = [];
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    let index = -1;
    const pipeline = fs
      .createReadStream(srcPath, { encoding: 'utf8' })
      .pipe(parser())
      .pipe(streamArray());

    pipeline.on('data', ({ value }: { value: any }) => {
      index++;
      if (index < start) return;
      if (index >= start + count) {
        pipeline.destroy();
        return;
      }
      const current = index + 1;
      const base = path.join(outDir, `conversation-${current}`);
      const jsonFile = `${base}.json`;
      const yamlFile = `${base}.yaml`;
      fs.writeFileSync(jsonFile, JSON.stringify(value, null, 2));
      fs.writeFileSync(yamlFile, yaml.dump(value));
      files.push(jsonFile);
    });

    const finalize = () => resolve(files);
    pipeline.on('end', finalize);
    pipeline.on('close', finalize);
    pipeline.on('error', reject);
  });
}

if (typeof require !== 'undefined' && require.main === module) {
  const args = process.argv.slice(2);
  const positional = args.filter((a: string) => !a.startsWith('--'));
  const flags = new Set(args.filter((a: string) => a.startsWith('--')));
  const src =
    positional[0] ||
    path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
  const out =
    positional[1] ||
    path.join(
      __dirname,
      '../docs/sigils/newadvancedconversations_fragments'
    );
  const start = parseInt(positional[2] || '0', 10);
  const count = parseInt(positional[3] || `${Number.POSITIVE_INFINITY}`, 10);
  const stream = flags.has('--stream');
  splitNewAdvancedConversations(src, out, start, count, { stream })
    .then(files => {
      console.log(`Wrote ${files.length} fragments to ${out}`);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
