import https from 'https';

export function dispatchCmd(task: string, endpoint = 'https://localhost:3000/dispatch'): Promise<number> {
  const data = JSON.stringify({ task });
  return new Promise((resolve, reject) => {
    const req = https.request(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': data.length } }, res => {
      resolve(res.statusCode ?? 0);
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}
