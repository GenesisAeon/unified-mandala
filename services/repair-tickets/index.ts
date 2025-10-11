export interface RepairTicket {
  id: string;
  file: string;
  status: 'open' | 'closed';
}

export class RepairTicketService {
  private tickets: RepairTicket[] = [];

  create(file: string): RepairTicket {
    const ticket: RepairTicket = {
      id: String(this.tickets.length + 1),
      file,
      status: 'open',
    };
    this.tickets.push(ticket);
    return ticket;
  }

  list(): RepairTicket[] {
    return this.tickets;
  }
}
