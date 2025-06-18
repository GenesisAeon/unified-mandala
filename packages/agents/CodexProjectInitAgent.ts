export class CodexProjectInitAgent {
  private projects: string[] = [];

  addProject(name: string): void {
    this.projects.push(name);
  }

  removeProject(name: string): boolean {
    const idx = this.projects.indexOf(name);
    if (idx >= 0) {
      this.projects.splice(idx, 1);
      return true;
    }
    return false;
  }

  list(): string[] {
    return this.projects;
  }
}
