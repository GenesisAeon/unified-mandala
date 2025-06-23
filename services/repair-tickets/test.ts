import { RepairTicketService } from './index';

test('creates and lists tickets', () => {
  const svc = new RepairTicketService();
  const t = svc.create('file.ts');
  expect(t).toEqual({ id: '1', file: 'file.ts', status: 'open' });
  expect(svc.list()).toEqual([t]);
});
