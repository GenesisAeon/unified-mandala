import { emitSigilAlert } from './sigil-alerts';

describe('sigil alerts', () => {
  it('emits alert when threshold exceeded', () => {
    const socket: any = { emit: jest.fn() };
    emitSigilAlert(socket, { energy: 0.9 }, 0.8);
    expect(socket.emit).toHaveBeenCalledWith('sigil_alert', expect.objectContaining({ id: 'aeon:2025-0626-HIGH-ENERGY' }));
  });

  it('does nothing below threshold', () => {
    const socket: any = { emit: jest.fn() };
    emitSigilAlert(socket, { energy: 0.5 }, 0.8);
    expect(socket.emit).not.toHaveBeenCalled();
  });
});
