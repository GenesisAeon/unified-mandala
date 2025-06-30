import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { socketAuth } from './auth';
import * as ws from "ws";
import { collectDefaultMetrics, register } from 'prom-client';

export function startServer(port = 3000, secret = 'ghost-secret', enableSocket: boolean = true) {
  collectDefaultMetrics();
  const app = express();

  app.get('/healthz', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
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
