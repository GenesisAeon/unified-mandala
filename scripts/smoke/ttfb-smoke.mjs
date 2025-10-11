import { spawn } from 'child_process';
import http from 'http';
import { setTimeout as sleep } from 'timers/promises';

const server = spawn('node', ['scripts/light-static-server.mjs'], { stdio: 'inherit' });

async function probe() {
  for (let attempt = 0; attempt < 20; attempt++) {
    try {
      const start = Date.now();
      const ttfb = await new Promise((resolve, reject) => {
        const req = http.get('http://127.0.0.1:3000/', (res) => {
          res.once('data', () => resolve(Date.now() - start));
          res.on('error', reject);
        });
        req.on('error', reject);
      });
      console.log(`TTFB ${ttfb}ms`);
      server.kill();
      process.exit(ttfb < 500 ? 0 : 1);
    } catch {
      await sleep(250);
    }
  }
  console.error('Server did not respond in time');
  server.kill();
  process.exit(1);
}

probe();
