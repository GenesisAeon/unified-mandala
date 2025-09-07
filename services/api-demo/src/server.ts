import express from "express";
import path from "node:path";
import { buildHealthRouter } from "@um/health";
import crep from "./routes/crep";

const app = express();
const PORT = Number(process.env.PORT || 3001);
const DIST = path.resolve("apps/mandala-ui/dist");

app.use(express.json());

// Beispiel: weitere API-Routen ...
app.use("/api/crep", crep);

app.use(buildHealthRouter({
  ready: () => true // hier z.B. prüfen: DB verb., Cache warm etc.
}));

// Static (falls benötigt)
app.use(express.static(DIST, { index: "index.html" }));

app.listen(PORT, () => console.log(`[api-demo] on :${PORT}`));
