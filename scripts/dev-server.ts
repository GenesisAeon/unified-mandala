import express from "express";
import path from "node:path";
import { ensureDefaultMetrics } from "../src/metrics/singleton";

const app = express();
const PORT = Number(process.env.PORT || 3000);
const UI_DIST = process.env.UI_DIST || path.resolve("apps/mandala-ui/dist");

ensureDefaultMetrics();

app.use(express.static(UI_DIST, { index: "index.html", fallthrough: true }));

// (Health kommt in PR-03 sauber via Paket; hier nur Basic)
app.get("/healthz", (_, res) => res.sendStatus(200));
app.get("/readyz",  (_, res) => res.sendStatus(204));

// History-Fallback: alle unbekannten Routen auf index.html
app.use((req, res) => res.sendFile(path.join(UI_DIST, "index.html")));

app.listen(PORT, () => {
  console.log(`[dev-server] :${PORT} → serving ${UI_DIST}`);
  console.log(`[dev-server] Deep links return index.html (History Fallback)`);
});
