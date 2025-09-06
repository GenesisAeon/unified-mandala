const express = require("express");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const UI_DIST = process.env.UI_DIST || path.resolve("apps/mandala-ui/dist");

app.use(express.static(UI_DIST, { index: "index.html", fallthrough: true }));

app.get("/healthz", (_, res) => res.sendStatus(200));
app.get("/readyz",  (_, res) => res.sendStatus(204));

app.use((req, res) => res.sendFile(path.join(UI_DIST, "index.html")));

app.listen(PORT, () => {
  console.log(`[dev-server] :${PORT} -> serving ${UI_DIST}`);
  console.log(`[dev-server] Deep links return index.html (History Fallback)`);
});
