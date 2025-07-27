export interface StructureBlueprint {
  name: string;
  foundationArea: number;
  height: number;
}

export function generateBlueprint(name: string): StructureBlueprint {
  const base = name.length * 100;
  return {
    name,
    foundationArea: base,
    height: base / 2,
  };
}

export function simulateStructure(name: string): string {
  const blueprint = generateBlueprint(name);
  return `Simulating ${blueprint.name} with area ${blueprint.foundationArea} and height ${blueprint.height}`;
}
