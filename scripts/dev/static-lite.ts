import http from "http";
import fs from "fs/promises";
import path from "path";
import { handleOps } from "./api-ops";
import { handleKpi, handleCrep } from "./api-kpi";

const distDir = path.resolve(__dirname, "../../apps/ui/dist");

const server = http.createServer(async (req, res) => {
  if (await handleKpi(req, res)) return;
  if (await handleCrep(req, res)) return;
  if (await handleOps(req, res)) return;
  try {
    let reqPath = req.url || "/";
    if (reqPath === "/") reqPath = "/index.html";
    const filePath = path.join(distDir, reqPath);
    const data = await fs.readFile(filePath);
    res.statusCode = 200;
    res.end(data);
  } catch {
    res.statusCode = 404;
    res.end("Not found");
  }
});

const port = Number(process.env.PORT) || 3000;
server.listen(port, () => {
  console.log(`Static lite server listening on http://localhost:${port}`);
});
