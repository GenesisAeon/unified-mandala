export interface MacroStep {
  action: string;
  [key: string]: any;
}

export interface Macro {
  steps: MacroStep[];
}

const ALLOWED_ACTIONS = ['click', 'type', 'wait', 'key'];

/**
 * Validate a macro definition.
 * Returns an array of error messages. An empty array means the macro is valid.
 */
export function validateMacro(macro: Macro): string[] {
  const errors: string[] = [];
  if (!macro || !Array.isArray(macro.steps)) {
    errors.push('steps must be an array');
    return errors;
  }
  macro.steps.forEach((step, idx) => {
    if (!step || typeof step.action !== 'string') {
      errors.push(`step ${idx} missing action`);
      return;
    }
    if (!ALLOWED_ACTIONS.includes(step.action)) {
      errors.push(`step ${idx} has invalid action ${step.action}`);
    }
  });
  return errors;
}

export const MacroDSL = {
  validateMacro,
  ALLOWED_ACTIONS,
};

export default MacroDSL;
