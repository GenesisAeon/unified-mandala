declare module 'tldts' {
  interface ParseOptions {
    allowPrivateDomains?: boolean;
  }

  interface ParseResult {
    domain?: string | null;
    hostname?: string | null;
  }

  export function parse(input: string, options?: ParseOptions): ParseResult;
}
