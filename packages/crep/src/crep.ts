export type NodeId = string;
export type Edge = { source: NodeId; target: NodeId; weight?: number };
export type Graph = {
  nodes: NodeId[];
  edges: Edge[];
  labels?: Record<NodeId, number>;
};

export type CREP = {
  coherence: number;
  resonance: number;
  emergence: number;
  poetics: number;
  crep: number;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

function normaliseEdge(edge: Edge): [NodeId, NodeId, number] | null {
  const { source, target } = edge;
  if (source === target) return null;
  const weight = edge.weight ?? 1;
  return source < target ? [source, target, weight] : [target, source, weight];
}

function uniqueEdges(edges: Edge[]): Edge[] {
  const seen = new Set<string>();
  const result: Edge[] = [];
  for (const edge of edges) {
    const normalised = normaliseEdge(edge);
    if (!normalised) continue;
    const [a, b, weight] = normalised;
    const key = `${a}::${b}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push({ source: a, target: b, weight });
    }
  }
  return result;
}

function density(nodes: NodeId[], edges: Edge[]): number {
  const n = nodes.length;
  if (n < 2) return 0;
  const m = uniqueEdges(edges).length;
  const max = (n * (n - 1)) / 2;
  if (max === 0) return 0;
  return clamp01(m / max);
}

export function computeCoherence(graph: Graph): number {
  const edges = uniqueEdges(graph.edges);
  if (!graph.labels || edges.length === 0) return 0.5;
  let matching = 0;
  for (const edge of edges) {
    const la = graph.labels[edge.source];
    const lb = graph.labels[edge.target];
    if (la !== undefined && lb !== undefined && la === lb) {
      matching += 1;
    }
  }
  return clamp01(matching / edges.length);
}

function rankEdges(edges: Edge[]): string[] {
  const ranked = uniqueEdges(edges)
    .map((edge) => ({
      key: `${edge.source}::${edge.target}`,
      weight: edge.weight ?? 1,
    }))
    .sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight;
      return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    });
  const limit = Math.max(3, Math.floor(Math.sqrt(ranked.length || 1)));
  return ranked.slice(0, limit).map((item) => item.key);
}

export function computeResonance(previous: Graph | undefined, current: Graph): number {
  if (!previous) return 0.5;
  const prevRanked = new Set(rankEdges(previous.edges));
  const currRanked = new Set(rankEdges(current.edges));
  if (prevRanked.size === 0 && currRanked.size === 0) return 1;
  let intersection = 0;
  for (const key of prevRanked) {
    if (currRanked.has(key)) intersection += 1;
  }
  const union = new Set([...prevRanked, ...currRanked]);
  return clamp01(union.size === 0 ? 0 : intersection / union.size);
}

export function computeEmergence(graph: Graph): number {
  const nodes = graph.nodes;
  if (nodes.length === 0) return 0;
  const edges = uniqueEdges(graph.edges);
  const adjacency = new Map<NodeId, Set<NodeId>>();
  for (const node of nodes) {
    adjacency.set(node, new Set<NodeId>());
  }
  for (const edge of edges) {
    adjacency.get(edge.source)?.add(edge.target);
    adjacency.get(edge.target)?.add(edge.source);
  }
  const seen = new Set<NodeId>();
  const components: NodeId[][] = [];
  for (const node of nodes) {
    if (seen.has(node)) continue;
    const stack = [node];
    const component: NodeId[] = [];
    seen.add(node);
    while (stack.length) {
      const current = stack.pop()!;
      component.push(current);
      for (const neighbour of adjacency.get(current) ?? []) {
        if (!seen.has(neighbour)) {
          seen.add(neighbour);
          stack.push(neighbour);
        }
      }
    }
    components.push(component);
  }
  const componentCount = components.length;
  const separation = componentCount === 1 ? 0 : 1 - 1 / Math.min(componentCount, nodes.length);
  let bridgeCount = 0;
  if (graph.labels) {
    for (const edge of edges) {
      const la = graph.labels[edge.source];
      const lb = graph.labels[edge.target];
      if (la !== undefined && lb !== undefined && la !== lb) {
        bridgeCount += 1;
      }
    }
  } else {
    bridgeCount = Math.round(edges.length * 0.5);
  }
  const bridgeRatio = edges.length === 0 ? 0.5 : bridgeCount / edges.length;
  return clamp01(separation * (1 - bridgeRatio));
}

export function computePoetics(graph: Graph): number {
  let entropy = 0.5;
  if (graph.labels) {
    const counts = new Map<number, number>();
    for (const node of Object.keys(graph.labels)) {
      const label = graph.labels[node as NodeId];
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
    const total = Array.from(counts.values()).reduce((sum, value) => sum + value, 0) || 1;
    entropy = 0;
    for (const value of counts.values()) {
      const probability = value / total;
      if (probability > 0) entropy += -probability * Math.log2(probability);
    }
    const maximum = Math.log2(Math.max(1, counts.size));
    entropy = maximum > 0 ? entropy / maximum : 0;
  }
  const structure = 1 - density(graph.nodes, graph.edges);
  return clamp01(0.5 * entropy + 0.5 * structure);
}

export function computeCREP(current: Graph, previous?: Graph): CREP {
  const coherence = computeCoherence(current);
  const resonance = computeResonance(previous, current);
  const emergence = computeEmergence(current);
  const poetics = computePoetics(current);
  const crep = (coherence + resonance + emergence + poetics) / 4;
  return { coherence, resonance, emergence, poetics, crep };
}
