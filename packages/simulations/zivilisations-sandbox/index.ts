export interface Megastructure {
  name: string;
  blocks: number;
}

export function estimateStability(structure: Megastructure): number {
  return Math.log(structure.blocks);
}
