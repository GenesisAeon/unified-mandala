import { Agent } from 'undici';
import dns from 'node:dns/promises';
import { URL } from 'node:url';

export async function makePinnedAgent(target: string): Promise<Agent> {
  const parsed = new URL(target);
  const { address } = await dns.lookup(parsed.hostname, { all: false, verbatim: true });
  return new Agent({
    connect: {
      host: address,
      servername: parsed.hostname,
      port: parsed.port ? Number.parseInt(parsed.port, 10) : undefined,
    },
  });
}
