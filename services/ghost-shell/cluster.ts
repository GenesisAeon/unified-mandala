import cluster from 'cluster';
import os from 'os';
import { startServer } from './server';

const basePort = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const secret = process.env.SECRET || 'ghost-secret';

if (cluster.isPrimary) {
  const cpus = os.cpus().length;
  for (let i = 0; i < cpus; i++) {
    cluster.fork({ PORT: (basePort + i).toString(), SECRET: secret });
  }
  cluster.on('exit', () => {
    cluster.fork();
  });
} else {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : basePort;
  startServer(port, secret);
}
