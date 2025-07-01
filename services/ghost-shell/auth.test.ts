import { socketAuth } from './auth';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({ verify: jest.fn() }));
const verify = (jwt as unknown as { verify: jest.Mock }).verify;

describe('ghost-shell auth', () => {
  beforeEach(() => {
    verify.mockReset();
  });

  it('sets socket.user with valid token', () => {
    const payload = { id: '123' };
    verify.mockReturnValue(payload);

    const socket: any = { handshake: { auth: { token: 'valid' } } };
    const next = jest.fn();

    socketAuth('secret')(socket, next);

    expect(verify).toHaveBeenCalledWith('valid', 'secret');
    expect(socket.user).toEqual(payload);
    expect(next).toHaveBeenCalledWith();
  });

  it('calls next with error on invalid token', () => {
    verify.mockImplementation(() => { throw new Error('bad'); });

    const socket: any = { handshake: { auth: { token: 'bad' } } };
    const next = jest.fn();

    socketAuth('secret')(socket, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
