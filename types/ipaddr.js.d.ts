declare module 'ipaddr.js' {
  type Range = [IPv4 | IPv6, number];

  export interface IPv4 {
    kind(): 'ipv4';
    range(): string;
    match(range: Range | IPv4 | IPv6): boolean;
    toString(): string;
    toNormalizedString(): string;
  }

  export interface IPv6 {
    kind(): 'ipv6';
    range(): string;
    match(range: Range): boolean;
    isIPv4MappedAddress(): boolean;
    toIPv4Address(): IPv4;
    toNormalizedString(): string;
  }

  export function parse(input: string): IPv4 | IPv6;
  export function parseCIDR(input: string): Range;
}
