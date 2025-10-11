export interface BehaviorSnapshot {
  id: string;
  response: string;
}

export interface BehaviorDiffResult {
  added: BehaviorSnapshot[];
  removed: BehaviorSnapshot[];
  changed: Array<{ id: string; from: string; to: string }>;
}

/**
 * BehavioralDiffViewer compares two sets of GPT responses
 * and highlights additions, removals and modifications.
 */
export class BehavioralDiffViewer {
  static diff(baseline: BehaviorSnapshot[], current: BehaviorSnapshot[]): BehaviorDiffResult {
    const baseMap = new Map(baseline.map((b) => [b.id, b.response]));
    const currMap = new Map(current.map((c) => [c.id, c.response]));

    const added: BehaviorSnapshot[] = [];
    const removed: BehaviorSnapshot[] = [];
    const changed: Array<{ id: string; from: string; to: string }> = [];

    for (const [id, resp] of currMap.entries()) {
      if (!baseMap.has(id)) {
        added.push({ id, response: resp });
      } else if (baseMap.get(id) !== resp) {
        changed.push({ id, from: baseMap.get(id)!, to: resp });
      }
    }

    for (const [id, resp] of baseMap.entries()) {
      if (!currMap.has(id)) {
        removed.push({ id, response: resp });
      }
    }

    return { added, removed, changed };
  }
}

export default BehavioralDiffViewer;
