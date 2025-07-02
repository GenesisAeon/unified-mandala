import { NextApiRequest, NextApiResponse } from 'next';
import { readRegistry, writeRegistry } from '../../lib/registry';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name } = req.body;
  const reg = readRegistry();
  reg[name] = { ...(reg[name] || {}), blacklisted: true, approved: false };
  writeRegistry(reg);
  res.status(204).end();
}
