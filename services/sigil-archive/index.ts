import fs from 'fs';
import path from 'path';

export async function archiveSigil(
  id: string,
  data: string,
  dir = 'GenesisAeonZIPMEM',
): Promise<string> {
  const file = path.join(dir, `${id}.yaml`);
  await fs.promises.mkdir(dir, { recursive: true });
  await fs.promises.writeFile(file, data, 'utf8');
  return file;
}
