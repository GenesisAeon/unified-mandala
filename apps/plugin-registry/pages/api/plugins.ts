import { NextApiRequest, NextApiResponse } from 'next';
import { listPlugins } from '../../../../services/plugin-loader';
import { readRegistry } from '../../lib/registry';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const registry = readRegistry();
  const plugins = listPlugins().map((p) => ({
    ...p,
    approved: registry[p.name]?.approved || false,
    blacklisted: registry[p.name]?.blacklisted || false,
    versionLock: registry[p.name]?.versionLock || null,
  }));
  res.status(200).json(plugins);
}
