import fs from 'fs';

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
