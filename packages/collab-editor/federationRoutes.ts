import https from 'https';

export function sendUpdate(endpoint: string, content: string): void {
  const data = JSON.stringify({ content });
  const req = https.request(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
  });
  req.on('error', () => {});
  req.write(data);
  req.end();
}
