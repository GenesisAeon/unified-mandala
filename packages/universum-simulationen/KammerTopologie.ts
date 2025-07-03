export interface Chamber {
  name: string;
  coordinates: [number, number, number];
}

export function mapToMemory(chambers: Chamber[]): Record<string, string> {
  const memoryMap: Record<string, string> = {};
  chambers.forEach((c, idx) => {
    memoryMap[c.name] = `mem_${idx}`;
  });
  return memoryMap;
}
