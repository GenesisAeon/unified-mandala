import { compile } from './compiler';
import { HookManager } from './hooks';
import { AeonDiagnostics } from './diagnostics';

describe('AeonUniversal hooks and diagnostics', () => {
  it('invokes hooks and collects diagnostics', () => {
    const manager = new HookManager();
    const called: string[] = [];
    manager.register('afterEmitSigil', ctx => {
      called.push(ctx.ast.type);
    });
    const diagnostics = new AeonDiagnostics();
    const result = compile('SIG Hello\nUNKNOWN', { hookManager: manager, diagnostics });
    expect(called[0]).toBe('EmitSigil');
    expect(result.diagnostics[0].code).toBe('UNKNOWN_CMD');
  });
});
