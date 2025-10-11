import { Macro } from './MacroDSL';

/**
 * Compile a macro into an AutoHotkey script.
 */
export function compileToAHK(macro: Macro): string {
  return macro.steps
    .map((step) => {
      switch (step.action) {
        case 'click':
          return `Click ${step.x ?? 0}, ${step.y ?? 0}`;
        case 'type':
          return `Send ${step.text ?? ''}`;
        case 'wait':
          return `Sleep ${step.ms ?? 0}`;
        case 'key':
          return `Send {${step.key ?? ''}}`;
        default:
          throw new Error(`Unknown action: ${step.action}`);
      }
    })
    .join('\n');
}

export default { compileToAHK };
