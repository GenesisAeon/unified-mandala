import cluster from 'cluster';
import os from 'os';
import { startServer } from './server';
import pino from 'pino';

const basePort = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const secret = process.env.SECRET || 'ghost-secret';
const logger = pino({ level: 'info' });

if (cluster.isPrimary) {
  const cpus = os.cpus().length;
  for (let i = 0; i < cpus; i++) {
    cluster.fork({ PORT: (basePort + i).toString(), SECRET: secret });
  }
  cluster.on('exit', (worker) => {
    logger.warn(`Worker ${worker.process.pid} crashed, restarting`);
    cluster.fork();
  });
} else {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : basePort;
  startServer(port, secret);
}
