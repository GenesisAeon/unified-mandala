import fs from 'fs';
import path from 'path';
import { splitJsonArray, splitJsonArrayFile, writeJsonChunks } from './jsonFragmenter';

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
});
