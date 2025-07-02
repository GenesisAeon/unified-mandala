import https from 'https';
import { Client, credentials } from '@grpc/grpc-js';

function dispatchGrpc(task: string, address: string): Promise<number> {
  const client = new Client(address, credentials.createInsecure());
  return new Promise((resolve, reject) => {
    client.makeUnaryRequest(
      '/DispatchService/Dispatch',
      arg => Buffer.from(JSON.stringify(arg)),
      buffer => JSON.parse(buffer.toString()),
      { task },
      (err, resp: any) => {
        client.close();
        if (err) return reject(err);
        resolve(resp?.status ?? 0);
      }
    );
  });
}

export function dispatchCmd(
  task: string,
  endpoint = 'https://localhost:3000/dispatch',
  protocol: 'rest' | 'grpc' = 'rest'
): Promise<number> {
  if (protocol === 'grpc') {
    return dispatchGrpc(task, endpoint);
  }
  const data = JSON.stringify({ task });
  return new Promise((resolve, reject) => {
    const req = https.request(
      endpoint,
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': data.length } },
      res => {
        resolve(res.statusCode ?? 0);
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}
