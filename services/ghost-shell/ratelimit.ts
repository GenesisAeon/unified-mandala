import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Socket } from 'socket.io';

const limiter = new RateLimiterMemory({ points: 10, duration: 60 });

export async function rateLimit(socket: Socket, next: (err?: Error) => void) {
  try {
    await limiter.consume(socket.handshake.address);
    next();
  } catch {
    next(new Error('Too many requests'));
  }
}
