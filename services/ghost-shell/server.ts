import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { socketAuth } from './auth';
import { WebSocketServer } from 'ws';
import { rateLimit } from './ratelimit';
import { logger } from './logger';
import { listPlugins, getPlugin } from '../plugin-loader';
import { verifyPluginManifest } from './blockchain-trust';
import { metricsMiddleware, metricsEndpoint } from '../../packages/core/middleware/metrics';
import path from 'path';
import fs from 'fs';
import { addSession, getSession, removeSession } from './session-store';
import { recordConnection, recordLatency } from './metrics';
import { joinRoom, sendRoomMessage, leaveAll, leaveRoom } from './rooms';
import { watchFragments } from './watchers/chokidar';
import { scheduleAdaptive } from './scheduler';
import { runSelfLearn } from '../../scripts/self-learn';
import { emitSigilAlert } from './sigil-alerts';
import { glob } from 'glob';

export function startServer(
  port = 3000,
  secret = 'ghost-secret',
  enableSocket: boolean = true,
  enableBackground: boolean = true,
) {
  const app = express();
  let ready = false;

  app.use(metricsMiddleware);

  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/healthz', (_req, res) => {
    res.json({ ok: true });
  });
  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/readyz', (_req, res) => {
    res.json({ ready });
  });

  app.get('/metrics', metricsEndpoint);

  app.get('/api/public/todos', (_req, res) => {
    try {
      const todoPath = path.join(__dirname, '..', '..', 'advancedToDo.json');
      const list = JSON.parse(fs.readFileSync(todoPath, 'utf8'));
      const open = list.filter((t: any) => t.status !== 'done');
      res.json({ open: open.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/plugins', (_req, res) => {
    res.json(listPlugins());
  });

  app.post('/api/plugin/activate', express.json(), (req, res) => {
    const { name } = req.body;
    try {
      const plugin = getPlugin(name);
      const manifest = listPlugins().find((p) => p.name === name) as any;
      if (!plugin || typeof plugin.initialize !== 'function' || !manifest) {
        throw new Error('Invalid plugin');
      }
      if (!verifyPluginManifest(manifest)) {
        throw new Error('Manifest verification failed');
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
    io = new Server(server, { cors: { origin: '*' }, wsEngine: WebSocketServer });
    io.use(socketAuth(secret));
    io.use(rateLimit);
    io.on('connection', (socket) => {
      addSession(socket.id);
      recordConnection();

      socket.on('join_room', (roomId: string) => {
        joinRoom(socket, roomId);
      });

      socket.on('leave_room', (roomId: string) => {
        leaveRoom(socket, roomId);
      });

      socket.on('room_message', ({ roomId, msg }) => {
        sendRoomMessage(io!, roomId, msg);
      });

      socket.on('user_message', (msg) => {
        const start = Date.now();
        const session = getSession(socket.id);
        if (session) {
          session.history.push(msg);
        }
        socket.emit('echo', msg);
        emitSigilAlert(socket, { energy: Math.random() });
        recordLatency(Date.now() - start);
      });

      socket.on('disconnect', () => {
        removeSession(socket.id);
        leaveAll(socket);
      });
    });
  }

  server.listen(port, () => {
    ready = true;
    logger.info(`GhostShellAgent listening on ${port}`);
  });

  let watcher: ReturnType<typeof watchFragments> | undefined;
  let scheduler: ReturnType<typeof scheduleAdaptive> | undefined;
  if (enableBackground) {
    const fragmentsPattern = path.join(
      __dirname,
      '..',
      '..',
      'GenesisAeonZIPMEM',
      'newadvancedconversations',
      '**',
      '*.yaml',
    );
    watcher = watchFragments(fragmentsPattern);
    scheduler = scheduleAdaptive(
      () => glob(fragmentsPattern).then((files) => files.length),
      runSelfLearn,
    );
  }

  return { app, io, server, watcher, scheduler };
}
