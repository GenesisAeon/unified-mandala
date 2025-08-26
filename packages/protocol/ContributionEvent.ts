export interface ContributionEvent {
  /** Unique identifier for the event */
  id: string;
  /** Actor identifier (person or agent) */
  actor: string;
  /** Short description of the contribution */
  contribution: string;
  /** Optional URI referencing provenance information */
  provenanceUri?: string;
  /** Amount of credit assigned to the actor */
  credits: number;
  /** ISO timestamp of when the contribution occurred */
  timestamp: string;
}

export type ContributionEventInput = Omit<ContributionEvent, 'id' | 'timestamp'>;
