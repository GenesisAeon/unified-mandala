import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { socketAuth } from './auth';
import * as ws from "ws";
import { register } from 'prom-client';
import { listPlugins, getPlugin } from '../plugin-loader';
import { metricsMiddleware, metricsEndpoint } from '../../packages/core/middleware/metrics';
import path from 'path';

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
      plugin.initialize({ io, logger: console.log, getPlugin });
      res.sendStatus(204);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  const server = http.createServer(app);
  let io: Server | null = null;
  if (enableSocket) {
    io = new Server(server, { cors: { origin: "*" }, wsEngine: ws.Server });
    io.use(socketAuth(secret));
    io.on("connection", (socket) => {
      socket.on("echo", (msg) => socket.emit("echo", msg));
    });
  }

  server.listen(port, () => {
    console.log(`GhostShellAgent listening on ${port}`);
  });

  return { app, io, server };
}
