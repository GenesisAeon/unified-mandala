export interface ResonanzNode {
  id: string;
  strength: number;
}

export interface ResonanzPosition extends ResonanzNode {
  /** Normalized radius (0..1) based on relative strength */
  radius: number;
  /** X coordinate on unit circle scaled by radius */
  x: number;
  /** Y coordinate on unit circle scaled by radius */
  y: number;
}

export interface ResonanzMandala {
  /** Total number of nodes processed */
  count: number;
  /** Calculated positions for each node */
  nodes: ResonanzPosition[];
}

/**
 * Build a simple radial layout for resonance nodes.
 * Each node is placed on a unit circle with its distance from the centre
 * scaled by its strength relative to the strongest node in the list.
 */
export function buildResonanzMandala(nodes: ResonanzNode[]): ResonanzMandala {
  if (nodes.length === 0) {
    return { count: 0, nodes: [] };
  }

  const maxStrength = Math.max(...nodes.map((n) => n.strength), 0);

  const positioned = nodes.map((node, index) => {
    const angle = (2 * Math.PI * index) / nodes.length;
    const radius = maxStrength === 0 ? 0 : node.strength / maxStrength;
    return {
      ...node,
      radius,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    } as ResonanzPosition;
  });

  return { count: nodes.length, nodes: positioned };
}
