import * as fs from 'fs';
import * as path from 'path';
import StreamJson from 'stream-json';
import StreamArray from 'stream-json/streamers/StreamArray.js';

const { parser } = StreamJson;
const { streamArray } = StreamArray;

/**
 * Splits an array into chunks of the given size.
 * @param items Array of items to chunk.
 * @param chunkSize Size of each chunk.
 */
export function splitJsonArray<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Reads a JSON array file and splits its content into chunks.
 * @param filePath Path to JSON array file.
 * @param chunkSize Number of items per chunk.
 */
export function splitJsonArrayFile<T>(filePath: string, chunkSize: number): T[][] {
  const raw = fs.readFileSync(filePath, 'utf8');
  const data: T[] = JSON.parse(raw);
  if (!Array.isArray(data)) {
    throw new Error('Input JSON must be an array');
  }
  return splitJsonArray(data, chunkSize);
}

/**
 * Writes chunks of a JSON array file into separate files.
 * Resulting files are named <basename>-<index>.json in destDir.
 * @param filePath Input JSON array file.
 * @param destDir Destination directory for chunk files.
 * @param chunkSize Number of items per chunk.
 */
export function writeJsonChunks(filePath: string, destDir: string, chunkSize: number) {
  const chunks = splitJsonArrayFile(filePath, chunkSize);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const base = filePath.replace(/\.json$/i, '');
  chunks.forEach((chunk, idx) => {
    const outPath = `${destDir}/${base.split('/').pop()}-${idx + 1}.json`;
    fs.writeFileSync(outPath, JSON.stringify(chunk, null, 2), 'utf8');
  });
}

/**
 * Streams a JSON array file and writes chunks without loading the entire file.
 * Resulting files are named <basename>-<index>.json in destDir.
 * @param filePath Input JSON array file.
 * @param destDir Destination directory for chunk files.
 * @param chunkSize Number of items per chunk.
 */
export function writeJsonChunksStream(
  filePath: string,
  destDir: string,
  chunkSize: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    const base = filePath.replace(/\.json$/i, '');
    let buffer: any[] = [];
    let index = 0;

    const pipeline = fs
      .createReadStream(filePath, { encoding: 'utf8' })
      .pipe(parser())
      .pipe(streamArray());

    pipeline.on('data', ({ value }: { value: any }) => {
      buffer.push(value);
      if (buffer.length >= chunkSize) {
        index++;
        const outPath = `${destDir}/${path.basename(base)}-${index}.json`;
        fs.writeFileSync(outPath, JSON.stringify(buffer, null, 2), 'utf8');
        buffer = [];
      }
    });

    pipeline.on('end', () => {
      if (buffer.length > 0) {
        index++;
        const outPath = `${destDir}/${path.basename(base)}-${index}.json`;
        fs.writeFileSync(outPath, JSON.stringify(buffer, null, 2), 'utf8');
      }
      resolve();
    });
    pipeline.on('error', reject);
  });
}

/**
 * Filters a JSON array file by a regex applied to each item's stringified form.
 * Matching items are written to <basename>-grep.json in destDir.
 * @param filePath Input JSON array file.
 * @param destDir Destination directory for grep result file.
 * @param pattern Regular expression used to match items.
 * @param limit Optional maximum number of matches to return.
 */
export function grepJsonArrayFile<T>(
  filePath: string,
  destDir: string,
  pattern: RegExp,
  limit?: number,
  start = 0,
  count = Infinity
): T[] {
  const raw = fs.readFileSync(filePath, 'utf8');
  const data: T[] = JSON.parse(raw);
  if (!Array.isArray(data)) {
    throw new Error('Input JSON must be an array');
  }
  const matches: T[] = [];
  const slice = data.slice(start, start + count);
  for (const item of slice) {
    if (pattern.test(JSON.stringify(item))) {
      matches.push(item);
      if (limit && matches.length >= limit) break;
    }
  }
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const base = filePath.replace(/\.json$/i, '');
  const outPath = `${destDir}/${base.split('/').pop()}-grep.json`;
  fs.writeFileSync(outPath, JSON.stringify(matches, null, 2), 'utf8');
  return matches;
}

/**
 * Streams a JSON array file and filters items by regex without loading
 * the entire file into memory. Matching items are written to
 * <basename>-grep.json in destDir.
 *
 * @param filePath Path to JSON array file.
 * @param destDir Destination directory for grep result file.
 * @param pattern Regular expression to test each item.
 * @param limit Optional maximum number of matches to return.
 */
export function grepJsonArrayFileStream<T>(
  filePath: string,
  destDir: string,
  pattern: RegExp,
  limit?: number,
  start = 0,
  count = Infinity
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const matches: T[] = [];
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    const base = filePath.replace(/\.json$/i, '');
    const outPath = `${destDir}/${path.basename(base)}-grep.json`;
    let index = -1;
    const pipeline = fs
      .createReadStream(filePath, { encoding: 'utf8' })
      .pipe(parser())
      .pipe(streamArray());

    pipeline.on('data', ({ value }: { value: T }) => {
      index++;
      if (index < start) return;
      if (index >= start + count) {
        pipeline.destroy();
        return;
      }
      if (pattern.test(JSON.stringify(value))) {
        matches.push(value);
        if (limit && matches.length >= limit) {
          pipeline.destroy();
        }
      }
    });

    const finalize = () => {
      fs.writeFileSync(outPath, JSON.stringify(matches, null, 2), 'utf8');
      resolve(matches);
    };
    pipeline.on('end', finalize);
    pipeline.on('close', finalize);
    pipeline.on('error', reject);
  });
}

/**
 * Streams a JSON array file and invokes a callback for each item without
 * loading the entire file into memory.
 *
 * @param filePath Path to the JSON array file.
 * @param onItem   Callback executed for every array element.
 * @param start    Optional index to begin processing.
 * @param count    Optional number of items to process.
 */
export function streamJsonArrayFile<T>(
  filePath: string,
  onItem: (item: T, index: number) => void | Promise<void>,
  start = 0,
  count = Infinity
): Promise<void> {
  return new Promise((resolve, reject) => {
    let index = -1;
    const pipeline = fs
      .createReadStream(filePath, { encoding: 'utf8' })
      .pipe(parser())
      .pipe(streamArray());

    const finalize = () => resolve();

    pipeline.on('data', async ({ value }: { value: T }) => {
      index++;
      if (index < start) return;
      if (index >= start + count) {
        pipeline.destroy();
        return;
      }
      try {
        await onItem(value, index);
      } catch (err) {
        pipeline.destroy();
        reject(err);
      }
    });

    pipeline.on('end', finalize);
    pipeline.on('close', finalize);
    pipeline.on('error', reject);
  });
}

/**
 * Extracts code snippets (```code```) from a JSON array file and writes them to individual files.
 * @param filePath Path to JSON array file.
 * @param destDir Output directory for snippets.
 */
export function extractCodeSnippetsFromFile(filePath: string, destDir: string): string[] {
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    throw new Error('Input JSON must be an array');
  }
  const snippets: string[] = [];
  const codeRegex = /```([\s\S]*?)```/g;
  function recurse(obj: any) {
    if (typeof obj === 'string') {
      let match: RegExpExecArray | null;
      while ((match = codeRegex.exec(obj))) {
        snippets.push(match[1].trim());
      }
    } else if (Array.isArray(obj)) {
      obj.forEach(recurse);
    } else if (obj && typeof obj === 'object') {
      Object.values(obj).forEach(recurse);
    }
  }
  data.forEach(recurse);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  snippets.forEach((snippet, idx) => {
    const outPath = `${destDir}/snippet-${idx + 1}.txt`;
    fs.writeFileSync(outPath, snippet);
  });
  return snippets;
}

/**
 * Merges all JSON array chunk files in a directory into a single output file.
 * The chunks must each contain a JSON array. Files are merged in lexicographical order.
 */
export function mergeJsonChunks(dir: string, outFile: string) {
  if (!fs.existsSync(dir)) throw new Error(`Directory not found: ${dir}`);
  const files = fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .sort();
  const merged: any[] = [];
  for (const f of files) {
    const data = JSON.parse(fs.readFileSync(`${dir}/${f}`, 'utf8'));
    if (!Array.isArray(data)) {
      throw new Error(`Chunk ${f} is not a JSON array`);
    }
    merged.push(...data);
  }
  fs.writeFileSync(outFile, JSON.stringify(merged, null, 2), 'utf8');
}
