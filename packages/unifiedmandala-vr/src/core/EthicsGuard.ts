export class EthicsGuard {
  private bannedWords = new Set<string>(['hate', 'attack', 'inject', 'weapon']);

  isSafe(content: string): boolean {
    return !Array.from(this.bannedWords).some(word =>
      content.toLowerCase().includes(word)
    );
  }
}
