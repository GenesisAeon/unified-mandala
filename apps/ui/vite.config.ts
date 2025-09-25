import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const aiApiTarget = process.env.MANDALA_AI_API_ORIGIN ?? "http://localhost:4000";

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
    },
  },
});
