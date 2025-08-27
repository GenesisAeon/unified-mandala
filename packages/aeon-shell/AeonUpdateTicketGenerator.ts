import { randomUUID } from 'crypto';

export interface AeonUpdateTicket {
  id: string;
  description: string;
  createdAt: Date;
}

/**
 * Generates update tickets for Aeon cycles.
 */
export class AeonUpdateTicketGenerator {
  create(description: string): AeonUpdateTicket {
    return {
      id: randomUUID(),
      description,
      createdAt: new Date(),
    };
  }
}
