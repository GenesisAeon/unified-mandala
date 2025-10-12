export class EthicsGuard {
  private banned = [/\battack\b/i, /\binject\b/i, /\bpayload\b/i];
  isSafe(text: string): boolean {
    return !this.banned.some((re) => re.test(text));
  }
}
