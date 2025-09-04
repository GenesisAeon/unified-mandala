const forbidden = [/credential/i, /harvest/i];

export function checkEthics(action: string): void {
  for (const rule of forbidden) {
    if (rule.test(action)) {
      throw new Error("Ethics violation");
    }
  }
}
