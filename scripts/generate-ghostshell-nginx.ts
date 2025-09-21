import fs from 'fs';
import os from 'os';

const PLACEHOLDER_SEQUENCE = [
  'PORT_BASE',
  'PORT_NEXT',
  'PORT_NEXT2',
  'PORT_NEXT3',
  'PORT_FLAGS',
  'PORT_EXTRA1',
  'PORT_EXTRA2',
  'PORT_EXTRA3',
] as const;

function getPorts(): number[] {
  const range = process.env.PORT_RANGE;
  if (range) {
    const [startStr, endStr] = range.split('-');
    const start = Number.parseInt(startStr, 10);
    const end = Number.parseInt(endStr, 10);
    if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
      throw new Error('Invalid PORT_RANGE format. Use START-END');
    }
    const ports: number[] = [];
    for (let p = start; p <= end; p += 1) ports.push(p);
    return ports;
  }
  const base = Number.parseInt(process.env.PORT_BASE || '3000', 10);
  const count = Number.parseInt(process.env.WORKER_COUNT || String(os.cpus().length), 10);
  return Array.from({ length: count }, (_, i) => base + i);
}

function buildServerLines(): string[] {
  if (process.env.GHOSTSHELL_PLACEHOLDERS === '0') {
    return getPorts().map((p) => `    server 127.0.0.1:${p};`);
  }

  const base = Number.parseInt(process.env.PORT_BASE || '3000', 10);
  return PLACEHOLDER_SEQUENCE.map((placeholder, index) => {
    const fallback = base + index;
    return `    server 127.0.0.1:\${${placeholder}:-${fallback}};`;
  });
}

function generateConfig() {
  const serverLines = buildServerLines().join('\n');
  const upstream = `upstream ghostshell {\n${serverLines}\n}\n`;
  return `${upstream}server {\n    listen 80;\n    location / {\n        proxy_pass http://ghostshell;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection "upgrade";\n        proxy_set_header Host $host;\n    }\n}\n`;
}

try {
  const conf = generateConfig();
  const out = process.argv[2] || 'config/nginx/ghostshell.conf';
  fs.writeFileSync(out, conf);
  console.log(`Generated ${out}`);
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}
