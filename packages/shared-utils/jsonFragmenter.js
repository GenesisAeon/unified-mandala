'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.splitJsonArray = splitJsonArray;
exports.splitJsonArrayFile = splitJsonArrayFile;
exports.writeJsonChunks = writeJsonChunks;
exports.writeJsonChunksStream = writeJsonChunksStream;
exports.grepJsonArrayFile = grepJsonArrayFile;
exports.grepJsonArrayFileStream = grepJsonArrayFileStream;
exports.streamJsonArrayFile = streamJsonArrayFile;
exports.extractCodeSnippetsFromFile = extractCodeSnippetsFromFile;
exports.mergeJsonChunks = mergeJsonChunks;
const fs_1 = require('fs');
const path_1 = require('path');
const stream_json_1 = require('stream-json');
const StreamArray_1 = require('stream-json/streamers/StreamArray.js');
/**
 * Splits an array into chunks of the given size.
 * @param items Array of items to chunk.
 * @param chunkSize Size of each chunk.
 */
function splitJsonArray(items, chunkSize) {
  const chunks = [];
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
function splitJsonArrayFile(filePath, chunkSize) {
  const raw = fs_1.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
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
function writeJsonChunks(filePath, destDir, chunkSize) {
  const chunks = splitJsonArrayFile(filePath, chunkSize);
  if (!fs_1.existsSync(destDir)) fs_1.mkdirSync(destDir, { recursive: true });
  const base = filePath.replace(/\.json$/i, '');
  chunks.forEach((chunk, idx) => {
    const outPath = `${destDir}/${base.split('/').pop()}-${idx + 1}.json`;
    fs_1.writeFileSync(outPath, JSON.stringify(chunk, null, 2), 'utf8');
  });
}

function writeJsonChunksStream(filePath, destDir, chunkSize) {
  return new Promise((resolve, reject) => {
    if (!fs_1.existsSync(destDir)) fs_1.mkdirSync(destDir, { recursive: true });
    const base = filePath.replace(/\.json$/i, '');
    let buffer = [];
    let index = 0;
    const pipeline = fs_1
      .createReadStream(filePath, { encoding: 'utf8' })
      .pipe((0, stream_json_1.parser)())
      .pipe((0, StreamArray_1.streamArray)());
    pipeline.on('data', ({ value }) => {
      buffer.push(value);
      if (buffer.length >= chunkSize) {
        index++;
        const outPath = `${destDir}/${(0, path_1.basename)(base)}-${index}.json`;
        fs_1.writeFileSync(outPath, JSON.stringify(buffer, null, 2), 'utf8');
        buffer = [];
      }
    });
    pipeline.on('end', () => {
      if (buffer.length > 0) {
        index++;
        const outPath = `${destDir}/${(0, path_1.basename)(base)}-${index}.json`;
        fs_1.writeFileSync(outPath, JSON.stringify(buffer, null, 2), 'utf8');
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
function grepJsonArrayFile(filePath, destDir, pattern, limit, start = 0, count = Infinity) {
  const raw = fs_1.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    throw new Error('Input JSON must be an array');
  }
  const matches = [];
  const slice = data.slice(start, start + count);
  for (const item of slice) {
    if (pattern.test(JSON.stringify(item))) {
      matches.push(item);
      if (limit && matches.length >= limit) break;
    }
  }
  if (!fs_1.existsSync(destDir)) fs_1.mkdirSync(destDir, { recursive: true });
  const base = filePath.replace(/\.json$/i, '');
  const outPath = `${destDir}/${base.split('/').pop()}-grep.json`;
  fs_1.writeFileSync(outPath, JSON.stringify(matches, null, 2), 'utf8');
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
function grepJsonArrayFileStream(filePath, destDir, pattern, limit, start = 0, count = Infinity) {
  return new Promise((resolve, reject) => {
    const matches = [];
    if (!fs_1.existsSync(destDir)) fs_1.mkdirSync(destDir, { recursive: true });
    const base = filePath.replace(/\.json$/i, '');
    const outPath = `${destDir}/${path_1.basename(base)}-grep.json`;
    let index = -1;
    const pipeline = fs_1
      .createReadStream(filePath, { encoding: 'utf8' })
      .pipe((0, stream_json_1.parser)())
      .pipe((0, StreamArray_1.streamArray)());
    pipeline.on('data', ({ value }) => {
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
      fs_1.writeFileSync(outPath, JSON.stringify(matches, null, 2), 'utf8');
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
 * @param {string} filePath Path to the JSON array file.
 * @param {(item:any,index:number)=>void|Promise<void>} onItem Callback executed per element.
 * @param {number} [start=0] Index to begin processing.
 * @param {number} [count=Infinity] Maximum number of items to process.
 * @returns {Promise<void>}
 */
function streamJsonArrayFile(filePath, onItem, start = 0, count = Infinity) {
  return new Promise((resolve, reject) => {
    let index = -1;
    const pipeline = (0, fs_1.createReadStream)(filePath, { encoding: 'utf8' })
      .pipe((0, stream_json_1.parser)())
      .pipe((0, StreamArray_1.streamArray)());
    const finalize = () => resolve();
    pipeline.on('data', async ({ value }) => {
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
function extractCodeSnippetsFromFile(filePath, destDir) {
  const raw = fs_1.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    throw new Error('Input JSON must be an array');
  }
  const snippets = [];
  const codeRegex = /```([\s\S]*?)```/g;
  function recurse(obj) {
    if (typeof obj === 'string') {
      let match;
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
  if (!fs_1.existsSync(destDir)) fs_1.mkdirSync(destDir, { recursive: true });
  snippets.forEach((snippet, idx) => {
    const outPath = `${destDir}/snippet-${idx + 1}.txt`;
    fs_1.writeFileSync(outPath, snippet);
  });
  return snippets;
}
/**
 * Merges all JSON array chunk files in a directory into a single output file.
 * The chunks must each contain a JSON array. Files are merged in lexicographical order.
 */
function mergeJsonChunks(dir, outFile) {
  if (!fs_1.existsSync(dir)) throw new Error(`Directory not found: ${dir}`);
  const files = fs_1
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort();
  const merged = [];
  for (const f of files) {
    const data = JSON.parse(fs_1.readFileSync(`${dir}/${f}`, 'utf8'));
    if (!Array.isArray(data)) {
      throw new Error(`Chunk ${f} is not a JSON array`);
    }
    merged.push(...data);
  }
  fs_1.writeFileSync(outFile, JSON.stringify(merged, null, 2), 'utf8');
}
