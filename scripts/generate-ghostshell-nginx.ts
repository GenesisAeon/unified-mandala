import fs from 'fs';
import os from 'os';

function getPorts(): number[] {
  const range = process.env.PORT_RANGE;
  if (range) {
    const [startStr, endStr] = range.split('-');
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);
    if (isNaN(start) || isNaN(end) || end < start) {
      throw new Error('Invalid PORT_RANGE format. Use START-END');
    }
    const ports: number[] = [];
    for (let p = start; p <= end; p++) ports.push(p);
    return ports;
  }
  const base = parseInt(process.env.PORT_BASE || '3000', 10);
  const count = parseInt(process.env.WORKER_COUNT || String(os.cpus().length), 10);
  return Array.from({ length: count }, (_, i) => base + i);
}

function generateConfig(ports: number[]) {
  let upstream = 'upstream ghostshell {\n';
  for (const p of ports) {
    upstream += `    server 127.0.0.1:${p};\n`;
  }
  upstream += '}\n';
  return `${upstream}server {\n    listen 80;\n    location / {\n        proxy_pass http://ghostshell;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection "upgrade";\n        proxy_set_header Host $host;\n    }\n}\n`;
}

try {
  const ports = getPorts();
  const conf = generateConfig(ports);
  const out = process.argv[2] || 'config/nginx/ghostshell.conf';
  fs.writeFileSync(out, conf);
  console.log(`Generated ${out} for ports: ${ports.join(', ')}`);
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}
