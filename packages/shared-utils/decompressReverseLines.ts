import fs from 'fs';
import zlib from 'zlib';
import readline from 'readline';

/**
 * Decompress a gzip file, reverse each line, and write the result to another file using streams.
 * @param input Path to the gzip-compressed input file.
 * @param output Path to the output file to write reversed lines.
 */
export async function decompressReverseLines(input: string, output: string): Promise<void> {
  const readStream = fs.createReadStream(input).pipe(zlib.createGunzip());
  const rl = readline.createInterface({ input: readStream, crlfDelay: Infinity });
  const writeStream = fs.createWriteStream(output);

  for await (const line of rl) {
    const reversed = [...line].reverse().join('');
    writeStream.write(reversed + '\n');
  }

  await new Promise<void>((resolve, reject) => {
    rl.on('close', resolve);
    rl.on('error', reject);
  });

  await new Promise<void>((resolve, reject) => {
    writeStream.end(() => resolve());
    writeStream.on('error', reject);
  });
}

if (require.main === module) {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) {
    console.error('Usage: decompressReverseLines <input.gz> <output.txt>');
    process.exit(1);
  }
  decompressReverseLines(input, output).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
