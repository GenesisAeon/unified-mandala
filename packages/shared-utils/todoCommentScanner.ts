export function scanTodoComments(text: string): string[] {
  const regex = /TODO[:\s](.*)/g;
  const matches: string[] = [];
  let m;
  while ((m = regex.exec(text)) !== null) {
    matches.push(m[1].trim());
  }
  return matches;
}
