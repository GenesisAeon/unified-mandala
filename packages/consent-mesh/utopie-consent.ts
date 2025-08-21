export interface VoteRecord {
  approve: number;
  reject: number;
}

const voteStore: Record<string, VoteRecord> = {};

/**
 * Submit a community vote for a utopia package.
 * @param packageName Name of the package to vote on.
 * @param approve True for approve, false for reject.
 */
export function submitVote(packageName: string, approve: boolean): void {
  if (!voteStore[packageName]) {
    voteStore[packageName] = { approve: 0, reject: 0 };
  }
  if (approve) {
    voteStore[packageName].approve++;
  } else {
    voteStore[packageName].reject++;
  }
}

/**
 * Returns approval ratio for a given package between 0 and 1.
 */
export function getConsentRatio(packageName: string): number {
  const record = voteStore[packageName];
  if (!record) return 0;
  const total = record.approve + record.reject;
  return total === 0 ? 0 : record.approve / total;
}

/**
 * Prioritize tasks based on community consent scores.
 */
export function prioritizeTasks<T extends { package: string }>(tasks: T[]): T[] {
  return tasks.slice().sort((a, b) => getConsentRatio(b.package) - getConsentRatio(a.package));
}

/**
 * Reset stored votes (mainly for tests).
 */
export function resetVotes(): void {
  for (const key of Object.keys(voteStore)) delete voteStore[key];
}
