import { EventEmitter } from 'events';

export interface AgentEdge {
  from: string;
  to: string;
}

/**
 * Simple in-memory graph that emits an `update` event whenever
 * edges are added. Consumers can subscribe to this event to
 * react to dependency changes in real time.
 */
export class AgentDependencyGraph extends EventEmitter {
  private graph: Record<string, string[]> = {};

  /** Add a directed edge and emit the updated graph */
  addEdge(edge: AgentEdge): void {
    const { from, to } = edge;
    if (!this.graph[from]) this.graph[from] = [];
    this.graph[from].push(to);
    this.emit('update', this.graph);
  }

  /** Retrieve a snapshot of the current adjacency list */
  getGraph(): Record<string, string[]> {
    return this.graph;
  }
}

/**
 * Build a simple adjacency list without emitting updates.
 * Kept for backward compatibility with existing code.
 */
export function buildAgentGraph(edges: AgentEdge[]): Record<string, string[]> {
  const graph = new AgentDependencyGraph();
  for (const edge of edges) graph.addEdge(edge);
  return graph.getGraph();
}
