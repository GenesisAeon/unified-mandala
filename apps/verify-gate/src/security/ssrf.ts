import dns from 'node:dns/promises';
import net from 'node:net';
import { URL } from 'node:url';

const allowlistEntries = (process.env.VERIFY_GATE_UPSTREAM_ALLOWLIST ?? '127.0.0.1:4000')
  .split(',')
  .map((entry: string) => entry.trim())
  .filter((entry: string) => entry.length > 0);

const allowlist = new Set(allowlistEntries);

function isPrivate(address: string): boolean {
  if (!net.isIP(address)) {
    return false;
  }

  if (address === '127.0.0.1' || address === '::1') {
    return true;
  }

  if (address.includes(':')) {
    // IPv6 private ranges – loopback already handled, treat fc00::/7 as private.
    return address.toLowerCase().startsWith('fc') || address.toLowerCase().startsWith('fd');
  }

  const parts = address.split('.').map((segment) => Number.parseInt(segment, 10));
  if (parts.length !== 4 || parts.some((segment) => Number.isNaN(segment))) {
    return false;
  }

  return (
    parts[0] === 10 ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168)
  );
}

export async function assertAllowed(target: string): Promise<void> {
  const url = new URL(target);
  const port = url.port ? Number.parseInt(url.port, 10) : url.protocol === 'https:' ? 443 : 80;
  const hostPort = `${url.hostname}:${port}`;

  if (!allowlist.has(hostPort)) {
    throw new Error('upstream_not_allowlisted');
  }

  const addresses = await dns
    .lookup(url.hostname, { all: true, verbatim: false })
    .catch(() => [] as Array<{ address: string }>);
  if (addresses.length === 0) {
    return;
  }

  for (const entry of addresses) {
    if (isPrivate(entry.address) && !allowlist.has(`${entry.address}:${port}`)) {
      throw new Error('upstream_private_blocked');
    }
  }
}
