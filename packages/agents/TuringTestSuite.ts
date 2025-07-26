export async function runTuringTest(respond: (input: string) => Promise<string>): Promise<boolean> {
  const q = 'Hello, how are you?';
  const answer = await respond(q);
  return !/\b(bot|AI)\b/i.test(answer);
}
