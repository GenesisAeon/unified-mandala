import { NextApiRequest, NextApiResponse } from 'next';
import { readRegistry, writeRegistry } from '../../lib/registry';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, version } = req.body;
  const reg = readRegistry();
  reg[name] = { ...(reg[name] || {}), versionLock: version };
  writeRegistry(reg);
  res.status(204).end();
}
