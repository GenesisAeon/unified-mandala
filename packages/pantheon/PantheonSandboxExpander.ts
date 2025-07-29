export interface SandboxConfig {
  name: string;
  size: number;
}

export class PantheonSandboxExpander {
  private sandboxes: Record<string, SandboxConfig> = {};

  addSandbox(config: SandboxConfig) {
    this.sandboxes[config.name] = config;
  }

  expand(name: string, factor: number) {
    const sandbox = this.sandboxes[name];
    if (!sandbox) throw new Error('Sandbox not found');
    sandbox.size *= factor;
    return sandbox;
  }
}
