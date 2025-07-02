export interface AgentEdge { from: string; to: string; }

export function buildAgentGraph(edges: AgentEdge[]): Record<string, string[]> {
  const graph: Record<string, string[]> = {};
  for (const { from, to } of edges) {
    if (!graph[from]) graph[from] = [];
    graph[from].push(to);
  }
  return graph;
}
