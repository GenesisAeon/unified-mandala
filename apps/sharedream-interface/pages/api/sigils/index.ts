import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = String(req.query.q || '').toLowerCase();
  const file = path.join(process.cwd(), '..', '..', 'data', 'sigils', 'sigillin.jsonl');
  let lines: string[] = [];
  try {
    const raw = fs.readFileSync(file, 'utf8');
    lines = raw.split('\n').filter(Boolean);
  } catch {
    res.status(500).json({ error: 'sigil data not available' });
    return;
  }
  const results = lines
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter((r): r is { file: string; content: string } => !!r && r.content.toLowerCase().includes(q))
    .slice(0, 20);
  res.status(200).json({ results });
}
