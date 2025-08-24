export class DocumentGenerator {
  generate(title: string, body: string): string {
    const header = `# ${title}`;
    return `${header}\n\n${body}`;
  }
}
