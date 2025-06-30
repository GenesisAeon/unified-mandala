import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

export function socketAuth(secret: string) {
  return (socket: Socket, next: (err?: Error) => void) => {
    const token = (socket.handshake as any).auth?.token;
    try {
      const payload = jwt.verify(token, secret);
      (socket as any).user = payload;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  };
}
