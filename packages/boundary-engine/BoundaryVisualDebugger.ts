export class BoundaryVisualDebugger {
  logs: string[] = [];

  logCollision(a: string, b: string) {
    this.logs.push(`${a}-${b}`);
  }
}
