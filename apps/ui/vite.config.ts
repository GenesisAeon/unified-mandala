import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const off = Number(process.env.PORT_OFFSET ?? "0") || 0;
const aiPort = (Number(process.env.AI_API_PORT ?? "4000") || 4000) + off;
const ragPort = (Number(process.env.RAG_API_PORT ?? "3003") || 3003) + off;
const flagsPort = (Number(process.env.FLAGS_API_PORT ?? "3004") || 3004) + off;
const sharePort = (Number(process.env.SHARE_API_PORT ?? "3001") || 3001) + off;
const experimentsPort = (Number(process.env.EXPERIMENTS_API_PORT ?? "3002") || 3002) + off;
const realtimePort = (Number(process.env.REALTIME_HUB_PORT ?? "4020") || 4020) + off;

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
      "/api/ai": {
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
