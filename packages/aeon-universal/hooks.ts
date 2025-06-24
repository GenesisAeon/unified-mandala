import { AeonDiagnostics } from './diagnostics';

export type HookName = 'beforeCompile' | 'afterEmitSigil' | 'onError';

export interface ASTNode {
  type: string;
  [key: string]: any;
}

export interface AeonHookContext {
  ast: ASTNode;
  diagnostics: AeonDiagnostics;
}

export type AeonHook = (ctx: AeonHookContext) => Promise<void> | void;

export class HookManager {
  private hooks: Record<HookName, AeonHook[]> = {
    beforeCompile: [],
    afterEmitSigil: [],
    onError: [],
  };

  register(name: HookName, fn: AeonHook): void {
    this.hooks[name].push(fn);
  }

  async invoke(name: HookName, ctx: AeonHookContext): Promise<void> {
    for (const fn of this.hooks[name]) {
      await Promise.resolve(fn(ctx));
    }
  }
}
