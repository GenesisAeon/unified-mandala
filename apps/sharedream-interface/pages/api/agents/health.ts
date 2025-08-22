import fs from 'fs';
import path from 'path';

export default function handler(req: any, res: any) {
  const logPath = path.join(process.cwd(), 'data', 'agents', 'heartbeats.jsonl');
  try {
    if (!fs.existsSync(logPath)) {
      res.status(200).json([]);
      return;
    }
    const lines = fs.readFileSync(logPath, 'utf8').trim().split('\n');
    const latest: Record<string, any> = {};
    for (const line of lines) {
      try {
        const event = JSON.parse(line);
        if (event.type === 'heartbeat') {
          latest[event.agentId] = event;
        }
      } catch {
        // ignore malformed lines
      }
    }
    res.status(200).json(Object.values(latest));
  } catch (err) {
    res.status(500).json({ error: 'unable to load agent heartbeats' });
  }
}
