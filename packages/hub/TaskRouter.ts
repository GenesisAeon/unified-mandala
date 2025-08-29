export interface Task {
  /** Unique task identifier */
  id: string;
  /** Required role for handling the task */
  requiredRole?: string;
}

export interface Peer {
  /** Unique peer identifier */
  id: string;
  /** Either a human contributor or an AI agent */
  kind: 'human' | 'ai';
  /** Roles that the peer is capable of fulfilling */
  roles: string[];
  /** Capability or reputation score (0-1) */
  score: number;
}

/**
 * Assign a task to the best matching peer.
 *
 * The router filters peers by the required role (if provided) and then chooses
 * the highest scoring candidate. If scores tie, human contributors are
 * preferred to encourage collaborative engagement.
 */
export function routeTask(task: Task, peers: Peer[]): Peer | undefined {
  const candidates = task.requiredRole
    ? peers.filter((p) => p.roles.includes(task.requiredRole!))
    : peers.slice();
  if (candidates.length === 0) return undefined;
  return candidates.sort((a, b) => {
    const diff = b.score - a.score;
    if (diff !== 0) return diff;
    // prefer humans on score ties
    if (a.kind === b.kind) return 0;
    return a.kind === 'human' ? -1 : 1;
  })[0];
}

/**
 * Assign multiple tasks to peers. Returns a mapping of task id to peer id.
 */
export function routeTasks(tasks: Task[], peers: Peer[]): Record<string, string> {
  const assignments: Record<string, string> = {};
  tasks.forEach((task) => {
    const assigned = routeTask(task, peers);
    if (assigned) assignments[task.id] = assigned.id;
  });
  return assignments;
}
