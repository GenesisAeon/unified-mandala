import { validateArgs } from './validateArgs';

export interface ToolSpec {
  name: string;
  description: string;
  parameters: object;
}

export type ToolHandler = (args: any) => any | Promise<any>;

interface ToolEntry {
  spec: ToolSpec;
  handler: ToolHandler;
}

export class ToolRegistry {
  private tools = new Map<string, ToolEntry>();

  register(spec: ToolSpec, handler: ToolHandler): void {
    if (!spec?.name) {
      throw new Error('Tool spec requires name');
    }
    this.tools.set(spec.name, { spec, handler });
  }

  list() {
    return Array.from(this.tools.values()).map(({ spec }) => ({
      type: 'function' as const,
      function: spec,
    }));
  }

  get(name: string): ToolEntry | undefined {
    return this.tools.get(name);
  }

  async invoke(name: string, args: unknown) {
    const entry = this.tools.get(name);
    if (!entry) {
      throw new Error(`Unknown tool: ${name}`);
    }
    validateArgs(entry.spec.parameters, args);
    return await entry.handler(args);
  }
}

export const toolRegistry = new ToolRegistry();
