class EthicsGuard {
  constructor() {
    this.banned = [/\battack\b/i, /\binject\b/i, /\bpayload\b/i];
  }
  isSafe(text) {
    return !this.banned.some((re) => re.test(text));
  }
}
module.exports = { EthicsGuard };
