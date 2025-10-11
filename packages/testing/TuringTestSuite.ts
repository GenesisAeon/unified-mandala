export async function runTuringSuite(
  responder: (input: string) => Promise<string>,
): Promise<boolean> {
  const prompts = ['Hello', 'What is 2 + 2?'];
  for (const p of prompts) {
    const r = await responder(p);
    if (/\b(bot|AI)\b/i.test(r)) {
      return false;
    }
  }
  return true;
}
