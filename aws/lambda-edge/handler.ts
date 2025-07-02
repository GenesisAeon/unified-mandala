import { startServer } from '../../services/ghost-shell/server';

let initialized = false;

export async function handler(event: any) {
  if (!initialized) {
    const secret = process.env.SECRET || 'ghost-secret';
    startServer(3000, secret, false);
    initialized = true;
  }
  return event.Records[0].cf.request;
}
