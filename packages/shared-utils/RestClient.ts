import http from 'http';
import https from 'https';

function getModule(url: string) {
  return url.startsWith('https') ? https : http;
}

export function callRest(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    getModule(url)
      .get(url, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      })
      .on('error', reject);
  });
}
