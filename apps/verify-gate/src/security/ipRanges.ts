import * as ipaddr from 'ipaddr.js';

export function normalizeIp(ip: string): string {
  const parsed = ipaddr.parse(ip);
  if (parsed.kind() === 'ipv6' && (parsed as ipaddr.IPv6).isIPv4MappedAddress()) {
    return (parsed as ipaddr.IPv6).toIPv4Address().toString();
  }
  return parsed.toNormalizedString();
}

export function isPrivateOrBlocked(ip: string): boolean {
  let parsed: ipaddr.IPv4 | ipaddr.IPv6;
  try {
    parsed = ipaddr.parse(ip);
  } catch {
    return true;
  }

  if (parsed.kind() === 'ipv4') {
    const v4 = parsed as ipaddr.IPv4;
    return (
      v4.range() !== 'unicast' ||
      v4.match(ipaddr.parseCIDR('0.0.0.0/8')) ||
      v4.match(ipaddr.parseCIDR('10.0.0.0/8')) ||
      v4.match(ipaddr.parseCIDR('100.64.0.0/10')) ||
      v4.match(ipaddr.parseCIDR('127.0.0.0/8')) ||
      v4.match(ipaddr.parseCIDR('169.254.0.0/16')) ||
      v4.match(ipaddr.parseCIDR('172.16.0.0/12')) ||
      v4.match(ipaddr.parseCIDR('192.0.0.0/24')) ||
      v4.match(ipaddr.parseCIDR('192.0.2.0/24')) ||
      v4.match(ipaddr.parseCIDR('192.168.0.0/16')) ||
      v4.match(ipaddr.parseCIDR('198.18.0.0/15')) ||
      v4.match(ipaddr.parseCIDR('198.51.100.0/24')) ||
      v4.match(ipaddr.parseCIDR('203.0.113.0/24')) ||
      v4.match(ipaddr.parseCIDR('224.0.0.0/4')) ||
      v4.match(ipaddr.parseCIDR('240.0.0.0/4'))
    );
  }

  const v6 = parsed as ipaddr.IPv6;
  return (
    v6.range() !== 'unicast' ||
    v6.match(ipaddr.parseCIDR('::/128')) ||
    v6.match(ipaddr.parseCIDR('::1/128')) ||
    v6.match(ipaddr.parseCIDR('::ffff:0:0/96')) ||
    v6.match(ipaddr.parseCIDR('fc00::/7')) ||
    v6.match(ipaddr.parseCIDR('fe80::/10')) ||
    v6.match(ipaddr.parseCIDR('2001:db8::/32')) ||
    v6.match(ipaddr.parseCIDR('2001::/32')) ||
    v6.match(ipaddr.parseCIDR('2002::/16')) ||
    v6.match(ipaddr.parseCIDR('64:ff9b::/96')) ||
    v6.match(ipaddr.parseCIDR('ff00::/8'))
  );
}
