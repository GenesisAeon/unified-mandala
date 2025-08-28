import * as fs from 'fs';
import * as path from 'path';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';

export interface ConversationSummary {
  title: string;
  nodes: number;
}

export function summarizeNewAdvancedConversations(filePath: string, limit?: number): Promise<ConversationSummary[]> {
  return new Promise((resolve, reject) => {
    const summaries: ConversationSummary[] = [];
    let resolved = false;
    const pipeline = fs
      .createReadStream(filePath, { encoding: 'utf8' })
      .pipe(parser())
      .pipe(streamArray());

    pipeline.on('data', ({ value }: { value: any }) => {
      const title = value.title || 'untitled';
      const mapping = value.mapping || {};
      const nodes = Object.keys(mapping).length;
      summaries.push({ title, nodes });
      if (limit && summaries.length >= limit) {
        resolved = true;
        pipeline.destroy();
        resolve(summaries);
      }
    });

    pipeline.on('end', () => {
      if (!resolved) resolve(summaries);
    });
    pipeline.on('error', reject);
  });
}

if (require.main === module) {
  const args: string[] = process.argv.slice(2);
  const fileIndex = args.findIndex((a: string) => a === '--file' || a === '-f');
  const limitIndex = args.findIndex((a: string) => a === '--limit' || a === '-n');
  const file = fileIndex >= 0 ? path.resolve(args[fileIndex + 1]) : path.join(__dirname, '../docs/sigils/newadvancedconversations.json');
  const limit = limitIndex >= 0 ? parseInt(args[limitIndex + 1], 10) : undefined;
  summarizeNewAdvancedConversations(file, limit).then(res => {
    console.log(JSON.stringify(res, null, 2));
  });
}
