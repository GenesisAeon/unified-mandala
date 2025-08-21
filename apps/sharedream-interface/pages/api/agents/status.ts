import fs from 'fs';
import path from 'path';

export default function handler(req: any, res: any) {
  const statusPath = path.join(process.cwd(), 'agents', 'status.json');
  try {
    const data = fs.readFileSync(statusPath, 'utf8');
    const json = JSON.parse(data);
    res.status(200).json(json);
  } catch (err: any) {
    res.status(500).json({ error: 'unable to load agent status' });
  }
}
