export interface Sandbox {
  name: string;
  structures: string[];
}

export function createSandbox(name: string): Sandbox {
  return { name, structures: [] };
}
