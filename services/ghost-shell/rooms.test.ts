import { joinRoom, sendRoomMessage, leaveAll, leaveRoom, getRoomMembers } from './rooms';

describe('rooms', () => {
  it('handles join and messaging', () => {
    const socket: any = { id: 's1', join: jest.fn(), emit: jest.fn() };
    const emitMock = jest.fn();
    const io: any = { to: jest.fn(() => ({ emit: emitMock })) };

    joinRoom(socket, 'r1');
    expect(socket.join).toHaveBeenCalledWith('r1');
    expect(getRoomMembers('r1')).toEqual(['s1']);

    sendRoomMessage(io, 'r1', 'hello');
    expect(io.to).toHaveBeenCalledWith('r1');
    expect(emitMock).toHaveBeenCalledWith('room_response', 'hello');

    leaveAll(socket);
    expect(getRoomMembers('r1')).toEqual([]);
  });

  it('removes a socket from a single room', () => {
    const socket: any = { id: 's2', join: jest.fn(), leave: jest.fn() };

    joinRoom(socket, 'roomA');
    joinRoom(socket, 'roomB');

    leaveRoom(socket, 'roomA');

    expect(socket.leave).toHaveBeenCalledWith('roomA');
    expect(getRoomMembers('roomA')).toEqual([]);
    expect(getRoomMembers('roomB')).toEqual(['s2']);

    leaveAll(socket);
  });
});
