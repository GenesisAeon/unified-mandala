import { AeonUpdateTicketGenerator } from '../AeonUpdateTicketGenerator';

describe('AeonUpdateTicketGenerator', () => {
  it('creates ticket with id and description', () => {
    const gen = new AeonUpdateTicketGenerator();
    const ticket = gen.create('sync context');
    expect(ticket.description).toBe('sync context');
    expect(ticket.id).toBeDefined();
    expect(ticket.createdAt).toBeInstanceOf(Date);
  });
});
