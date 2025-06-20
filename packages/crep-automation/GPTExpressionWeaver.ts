export interface ExpressionInput {
  crep: { C: number; R: number; E: number; P: number };
  symbolzeit: string;
  theme: string;
}

export function weaveExpression(input: ExpressionInput): string {
  const { crep, symbolzeit, theme } = input;
  return `(${symbolzeit}) [${theme}] C:${crep.C} R:${crep.R} E:${crep.E} P:${crep.P}`;
}
