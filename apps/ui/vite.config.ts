import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const off = Number(process.env.PORT_OFFSET ?? "0") || 0;

const resolvePort = (envKey: string, fallback: number) => {
  const raw = process.env[envKey];
  const parsed = Number(raw);
  if (Number.isFinite(parsed) && parsed > 0) {
    if (off !== 0 && parsed === fallback) {
      return fallback + off;
    }
    return parsed;
  }
  return fallback + off;
};

const aiPort = resolvePort("AI_API_PORT", 4000);
const ragPort = resolvePort("RAG_API_PORT", 3003);
const flagsPort = resolvePort("FLAGS_API_PORT", 3004);
const sharePort = resolvePort("SHARE_API_PORT", 3001);
const experimentsPort = resolvePort("EXPERIMENTS_API_PORT", 3002);
const realtimePort = resolvePort("REALTIME_HUB_PORT", 4020);

const aiApiTarget = process.env.MANDALA_AI_API_ORIGIN ?? `http://localhost:${aiPort}`;
const realtimeWs = process.env.VITE_REALTIME_WS ?? `ws://localhost:${realtimePort}/ws?topic=demo.cosmic`;
const realtimeSse = process.env.VITE_REALTIME_SSE ?? `http://localhost:${realtimePort}/sse?topic=demo.cosmic`;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~config": path.resolve(__dirname, "../../config"),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: aiApiTarget,
        changeOrigin: true,
      },
      "/rag": {
        target: `http://localhost:${ragPort}`,
        changeOrigin: true,
      },
      "/flags": {
        target: `http://localhost:${flagsPort}`,
        changeOrigin: true,
      },
      "/experiments": {
        target: `http://localhost:${experimentsPort}`,
        changeOrigin: true,
      },
      "/share": {
        target: `http://localhost:${sharePort}`,
        changeOrigin: true,
      },
    },
  },
  define: {
    "import.meta.env.VITE_REALTIME_WS": JSON.stringify(realtimeWs),
    "import.meta.env.VITE_REALTIME_SSE": JSON.stringify(realtimeSse),
  },
});
