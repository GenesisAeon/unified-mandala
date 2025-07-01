import { Server, Socket } from 'socket.io';

const rooms = new Map<string, Set<string>>();

export function joinRoom(socket: Socket, roomId: string): void {
  socket.join(roomId);
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId)!.add(socket.id);
}

export function sendRoomMessage(io: Server, roomId: string, msg: any): void {
  io.to(roomId).emit('room_response', msg);
}

export function leaveRoom(socket: Socket, roomId: string): void {
  socket.leave(roomId);
  const members = rooms.get(roomId);
  if (members) {
    members.delete(socket.id);
    if (members.size === 0) {
      rooms.delete(roomId);
    }
  }
}

export function leaveAll(socket: Socket): void {
  rooms.forEach((members, roomId) => {
    members.delete(socket.id);
    if (members.size === 0) {
      rooms.delete(roomId);
    }
  });
}

export function getRoomMembers(roomId: string): string[] {
  return Array.from(rooms.get(roomId) || []);
}
