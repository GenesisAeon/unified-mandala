import { Server } from 'socket.io';

export class AeonOrchestrator {
  private io: Server;
  constructor(server: any) {
    this.io = new Server(server);
  }
  start() {
    this.io.on('connection', (socket) => {
      socket.emit('welcome', 'Aeon Orchestrator active');
    });
  }
}
