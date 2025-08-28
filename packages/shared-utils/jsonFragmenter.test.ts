import fs from 'fs';
import path from 'path';
import {
  splitJsonArray,
  splitJsonArrayFile,
  writeJsonChunks,
  writeJsonChunksStream,
  grepJsonArrayFile,
  grepJsonArrayFileStream,
} from './jsonFragmenter';

describe('jsonFragmenter', () => {
  const tmpDir = path.join(__dirname, '__tmp__');
  const sampleFile = path.join(tmpDir, 'sample.json');

  beforeAll(() => {
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    fs.writeFileSync(sampleFile, JSON.stringify([1,2,3,4,5]), 'utf8');
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('splitJsonArray splits arrays', () => {
    const chunks = splitJsonArray([1,2,3,4,5], 2);
    expect(chunks).toEqual([[1,2],[3,4],[5]]);
  });

  test('splitJsonArrayFile reads and splits files', () => {
    const chunks = splitJsonArrayFile<number>(sampleFile, 3);
    expect(chunks.length).toBe(2);
    expect(chunks[0]).toEqual([1,2,3]);
    expect(chunks[1]).toEqual([4,5]);
  });

  test('writeJsonChunks writes files', () => {
    const dest = path.join(tmpDir, 'out');
    writeJsonChunks(sampleFile, dest, 2);
    const files = fs.readdirSync(dest).sort();
    expect(files.length).toBe(3);
    const data1 = JSON.parse(fs.readFileSync(path.join(dest, files[0]), 'utf8'));
    expect(data1).toEqual([1,2]);
  });

  test('writeJsonChunksStream streams and writes files', async () => {
    const dest = path.join(tmpDir, 'out-stream');
    await writeJsonChunksStream(sampleFile, dest, 2);
    const files = fs.readdirSync(dest).sort();
    expect(files.length).toBe(3);
    const data1 = JSON.parse(fs.readFileSync(path.join(dest, files[0]), 'utf8'));
    expect(data1).toEqual([1,2]);
  });

  test('grepJsonArrayFile filters items and writes output', () => {
    const grepDest = path.join(tmpDir, 'grep');
    const matches = grepJsonArrayFile(sampleFile, grepDest, /3|4/);
    expect(matches).toEqual([3,4]);
    const outPath = path.join(grepDest, 'sample-grep.json');
    const written = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    expect(written).toEqual([3,4]);
  });

  test('grepJsonArrayFileStream streams items without full load', async () => {
    const grepDest = path.join(tmpDir, 'grep-stream');
    const matches = await grepJsonArrayFileStream(sampleFile, grepDest, /4|5/);
    expect(matches).toEqual([4,5]);
    const outPath = path.join(grepDest, 'sample-grep.json');
    const written = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    expect(written).toEqual([4,5]);
  });

  test('grepJsonArrayFile respects start and count', () => {
    const dest = path.join(tmpDir, 'grep-start');
    const matches = grepJsonArrayFile(sampleFile, dest, /1|2|3/, undefined, 1, 2);
    expect(matches).toEqual([2,3]);
  });

  test('grepJsonArrayFileStream respects start and count', async () => {
    const dest = path.join(tmpDir, 'grep-stream-start');
    const matches = await grepJsonArrayFileStream(sampleFile, dest, /4|5/, undefined, 3, 1);
    expect(matches).toEqual([4]);
  });
});
