import { Socket } from 'socket.io';

export function emitSigilAlert(
  socket: Socket,
  result: { energy: number },
  threshold = 0.8
) {
  if (result.energy > threshold) {
    socket.emit('sigil_alert', {
      id: 'aeon:2025-0626-HIGH-ENERGY',
      effect: 'pulse-red',
    });
  }
}
