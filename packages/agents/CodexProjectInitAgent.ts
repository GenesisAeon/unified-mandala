export class CodexProjectInitAgent {
  private projects: string[] = [];

  addProject(name: string): void {
    this.projects.push(name);
  }

  list(): string[] {
    return this.projects;
  }
}
