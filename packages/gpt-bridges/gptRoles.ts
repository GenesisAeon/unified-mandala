export enum GPTRole {
  AEON = 'aeon',
  CREP = 'crep',
  POET = 'poet',
}

export const isValidRole = (role: string): role is GPTRole =>
  Object.values(GPTRole).includes(role as GPTRole);

