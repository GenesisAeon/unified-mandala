import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

export function archiveOldTodos(src: string, destDir: string) {
  const content = fs.readFileSync(src, 'utf8');
  const outPath = path.join(destDir, path.basename(src) + '.gz');
  fs.mkdirSync(destDir, { recursive: true });
  const gz = zlib.gzipSync(content);
  fs.writeFileSync(outPath, gz);
  return outPath;
}
