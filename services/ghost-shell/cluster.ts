import cluster from "cluster";
import os from "os";
import { startServer } from "./server";
import { logger } from "./logger";

function getPorts(): number[] {
  const range = process.env.PORT_RANGE;
  if (range) {
    const [startStr, endStr] = range.split("-");
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);
    if (isNaN(start) || isNaN(end) || end < start) {
      throw new Error("Invalid PORT_RANGE format. Use START-END");
    }
    const ports: number[] = [];
    for (let p = start; p <= end; p++) ports.push(p);
    return ports;
  }
  const base = parseInt(process.env.PORT_BASE || "3000", 10);
  const count = parseInt(
    process.env.WORKER_COUNT || String(os.cpus().length),
    10,
  );
  return Array.from({ length: count }, (_, i) => base + i);
}

const secret = process.env.SECRET || "ghost-secret";

if (cluster.isPrimary) {
  const ports = getPorts();
  for (const port of ports) {
    cluster.fork({ PORT: port.toString(), SECRET: secret });
  }
  cluster.on("exit", (worker) => {
    logger.warn(`Worker ${worker.process.pid} crashed, restarting`);
    cluster.fork();
  });
} else {
  const port = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : parseInt(process.env.PORT_BASE || "3000", 10);
  startServer(port, secret);
}
