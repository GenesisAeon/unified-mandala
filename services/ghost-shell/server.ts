import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { socketAuth } from './auth';
import * as ws from 'ws';
import { rateLimit } from './ratelimit';
import { logger } from './logger';
import { listPlugins, getPlugin } from '../plugin-loader';
import { metricsMiddleware, metricsEndpoint } from '../../packages/core/middleware/metrics';
import path from 'path';
import { addSession, getSession, removeSession } from './session-store';
import { recordConnection, recordLatency } from './metrics';
import { joinRoom, sendRoomMessage, leaveAll } from './rooms';

export function startServer(port = 3000, secret = 'ghost-secret', enableSocket: boolean = true) {
  const app = express();

  app.use(metricsMiddleware);

  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/healthz', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/metrics', metricsEndpoint);

  app.get('/api/plugins', (_req, res) => {
    res.json(listPlugins());
  });

  app.post('/api/plugin/activate', express.json(), (req, res) => {
    const { name } = req.body;
    try {
      const plugin = getPlugin(name);
      if (!plugin || typeof plugin.initialize !== 'function') {
        throw new Error('Invalid plugin');
      }
      plugin.initialize({ io, logger: (msg: string) => logger.info(msg), getPlugin });
      res.sendStatus(204);
    } catch (e: any) {
      logger.error(e);
      res.status(400).json({ error: e.message });
    }
  });

  const server = http.createServer(app);
  let io: Server | null = null;
  if (enableSocket) {
    io = new Server(server, { cors: { origin: "*" }, wsEngine: ws.Server });
    io.use(socketAuth(secret));
    io.use(rateLimit);
    io.on("connection", (socket) => {
      addSession(socket.id);
      recordConnection();

      socket.on("join_room", (roomId: string) => {
        joinRoom(socket, roomId);
      });

      socket.on("room_message", ({ roomId, msg }) => {
        sendRoomMessage(io!, roomId, msg);
      });

      socket.on("user_message", (msg) => {
        const start = Date.now();
        const session = getSession(socket.id);
        if (session) {
          session.history.push(msg);
        }
        socket.emit("echo", msg);
        recordLatency(Date.now() - start);
      });

      socket.on("disconnect", () => {
        removeSession(socket.id);
        leaveAll(socket);
      });
    });
  }

  server.listen(port, () => {
    logger.info(`GhostShellAgent listening on ${port}`);
  });

  return { app, io, server };
}
