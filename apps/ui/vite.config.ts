import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~config": path.resolve(__dirname, "..", "..", "src", "config"),
    },
  },
  server: { host: true, port: 5173 }
});
